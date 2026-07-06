from fastapi import FastAPI, APIRouter, HTTPException, Header, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import anthropic as anthropic_sdk

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

_raw_mongo = (
    os.environ.get('MONGO_URL') or
    os.environ.get('MONGOURL') or
    os.environ.get('MONGODB_URL') or
    os.environ.get('DATABASE_URL') or
    'mongodb://localhost:27017'
)
if not (_raw_mongo.startswith('mongodb://') or _raw_mongo.startswith('mongodb+srv://')):
    _raw_mongo = 'mongodb://localhost:27017'
mongo_url = _raw_mongo
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'caars_db')]

ANTHROPIC_API_KEY = os.environ['ANTHROPIC_API_KEY']
EMERGENT_AUTH_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"

async def llm_chat(system_message: str, user_message: str, history: list | None = None) -> str:
    aclient = anthropic_sdk.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
    messages = []
    if history:
        for h in history:
            messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": user_message})
    msg = await aclient.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=system_message,
        messages=messages,
    )
    return msg.content[0].text

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', '')
GOOGLE_REDIRECT_URI = os.environ.get('GOOGLE_REDIRECT_URI', '')
GOOGLE_SCOPES_EMAIL = " ".join([
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.modify",
    "openid", "email", "profile",
])
GOOGLE_SCOPES_CALENDAR = " ".join([
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "openid", "email", "profile",
])
# Legacy alias
GOOGLE_SCOPES = GOOGLE_SCOPES_EMAIL

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---------- MODELS ----------
class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SessionExchange(BaseModel):
    session_id: str

class BusinessProfile(BaseModel):
    user_id: str
    owner_name: str = "Yrittäjä"
    company_name: str = "CAARS.fi"
    company_description: str = (
        "CAARS.fi on suomalainen tuontiautoliike. Tuomme premium-autoja "
        "Saksasta ja muualta Euroopasta suomalaisille asiakkaille. "
        "Hoidamme rekisteröinnin, autoveron ja kaiken paperityön asiakkaan puolesta."
    )
    tone: str = "Ammatillinen, ystävällinen, suora, suomeksi. Käytä teitittelyä jos asiakas teitittelee, muuten sinuttele."
    signature: str = "Ystävällisin terveisin,\n{owner_name}\nCAARS.fi\n+358 40 000 0000"
    knowledge: str = (
        "Autovero: Suomessa tuontiautoista maksetaan autovero, joka määräytyy CO2-päästöjen ja auton arvon mukaan. "
        "Rekisteröinti: Hoidamme rekisteröinnin Traficomissa asiakkaan puolesta. "
        "Maahantuonti: Hoidamme koko prosessin: auton osto, kuljetus, tullaus, vero, katsastus, rekisteröinti. "
        "Toimitusaika: tyypillisesti 2-4 viikkoa tilauksesta luovutukseen."
    )
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AutoReplyRule(BaseModel):
    rule_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    trigger_keywords: List[str] = []
    trigger_sender_contains: Optional[str] = None
    instruction: str
    enabled: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReplyTemplate(BaseModel):
    template_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    trigger_description: str = ""  # "Kun asiakas kysyy etsintäpalvelusta"
    template_text: str
    enabled: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EmailMessage(BaseModel):
    email_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    sender_name: str
    sender_email: str
    subject: str
    body: str
    received_at: datetime
    category: Literal["customer_lead", "customer_existing", "internal", "other"] = "customer_lead"
    status: Literal["needs_review", "approved", "sent", "skipped"] = "needs_review"
    is_first_email: bool = True
    suggested_reply: Optional[str] = None
    final_reply: Optional[str] = None
    source: str = "gmail"  # gmail | caars_web_form

class Task(BaseModel):
    task_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    description: Optional[str] = None
    due_at: datetime
    completed: bool = False
    source: Literal["calendar", "manual", "email"] = "manual"
    location: Optional[str] = None
    reminder_sent: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InvoiceItem(BaseModel):
    description: str
    quantity: float = 1.0
    unit_price: float
    unit: str = "kpl"

class Invoice(BaseModel):
    invoice_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    client_name: str
    client_email: Optional[str] = None
    items: List[InvoiceItem] = []
    status: Literal["draft", "sent", "paid"] = "draft"
    due_date: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatMessage(BaseModel):
    message_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    role: Literal["user", "assistant"]
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ---------- HELPERS ----------
def doc_to_dict(doc):
    if doc and "_id" in doc:
        del doc["_id"]
    return doc

async def get_user_from_token(authorization: Optional[str]) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1]
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    expires_at = session["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    user_doc = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user_doc)

CAARS_KEYWORDS = [
    "caars", "auto", "car", "tuonti", "import", "hinta", "ostaa", "myydä", "myy",
    "ajoneuvo", "merkki", "malli", "vuosimalli", "tarjous", "tilaus", "vaihto",
    "käytetty", "uusi auto", "tuoda", "tilata", "kiinnostunut",
]

def _is_caars_first_contact(email_doc: dict) -> bool:
    text = ((email_doc.get("subject") or "") + " " + (email_doc.get("body") or "")).lower()
    return any(kw in text for kw in CAARS_KEYWORDS)

async def _internal_generate_and_send(user_id: str, email_doc: dict, email_tokens: dict):
    """Generate reply and send via Gmail — no HTTP auth, called internally from sync."""
    try:
        profile = await get_business_profile(user_id)
        rules_cursor = db.auto_reply_rules.find({"user_id": user_id, "enabled": True}, {"_id": 0})
        rules = await rules_cursor.to_list(100)
        rules_text = "\n".join([f"- {r['name']}: {r['instruction']}" for r in rules]) or "Ei erillisiä sääntöjä."
        system = f"""Olet Caars.fi:n asiakaspalveluagentti. Vastaat asiakkaiden ensiyhteydenottoihin automaattisesti.
Yrityksen tiedot:
- Nimi: {profile.company_name}
- Yrittäjä: {profile.owner_name}
- Liiketoiminta: {profile.company_description}

Tieto-osaaminen:
{profile.knowledge}

Sävy: {profile.tone}

Erityisohjeet:
{rules_text}

Allekirjoitus:
{profile.signature.replace('{owner_name}', profile.owner_name)}

Vastaa AINA suomeksi. Ole lämmin, ammattimainen ja konkreettinen. Kerro lyhyesti mitä Caars.fi tekee ja pyydä asiakas ottamaan yhteyttä tai kysymään lisää."""
        user_msg = f"""Asiakas: {email_doc['sender_name']} <{email_doc['sender_email']}>
Aihe: {email_doc['subject']}

Viesti:
{email_doc['body']}

Kirjoita ammattimainen ensivastaus Caars.fi:n asiakkaalle."""
        reply_text = await llm_chat(system, user_msg)
        email_id = email_doc["email_id"]
        await db.emails.update_one(
            {"email_id": email_id},
            {"$set": {"suggested_reply": reply_text, "final_reply": reply_text}},
        )
        subject = email_doc["subject"]
        if not subject.lower().startswith("re:"):
            subject = f"Re: {subject}"
        sent = await send_via_gmail(
            user_id=user_id,
            to_email=email_doc["sender_email"],
            subject=subject,
            body=reply_text,
            in_reply_to_message_id=email_doc.get("gmail_message_id"),
            thread_id=email_doc.get("gmail_thread_id"),
            token_override=email_tokens,
        )
        await db.emails.update_one(
            {"email_id": email_id},
            {"$set": {"status": "auto_replied", "sent_at": datetime.now(timezone.utc), "sent_via_gmail": sent}},
        )
    except Exception as e:
        print(f"[auto-reply] virhe: {e}")

async def get_business_profile(user_id: str) -> BusinessProfile:
    doc = await db.business_profiles.find_one({"user_id": user_id}, {"_id": 0})
    if not doc:
        profile = BusinessProfile(user_id=user_id)
        await db.business_profiles.insert_one(profile.dict())
        return profile
    return BusinessProfile(**doc)

# ---------- AUTH ----------
@api_router.post("/auth/session")
async def exchange_session(data: SessionExchange):
    async with httpx.AsyncClient() as hx:
        resp = await hx.get(EMERGENT_AUTH_URL, headers={"X-Session-ID": data.session_id}, timeout=15.0)
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session ID")
    payload = resp.json()
    email = payload["email"]
    name = payload.get("name", email.split("@")[0])
    picture = payload.get("picture")
    session_token = payload["session_token"]

    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one({"user_id": user_id}, {"$set": {"name": name, "picture": picture}})
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        new_user = User(user_id=user_id, email=email, name=name, picture=picture)
        await db.users.insert_one(new_user.dict())

    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.update_one(
        {"session_token": session_token},
        {"$set": {
            "session_token": session_token,
            "user_id": user_id,
            "expires_at": expires_at,
            "created_at": datetime.now(timezone.utc),
        }},
        upsert=True,
    )

    # Seed demo data on first sign-in
    await seed_user_data(user_id)
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return {"session_token": session_token, "user": user_doc}

@api_router.get("/auth/me")
async def get_me(authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    profile = await get_business_profile(user.user_id)
    return {"user": user.dict(), "business_profile": profile.dict()}

@api_router.post("/auth/logout")
async def logout(authorization: Optional[str] = Header(default=None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
        await db.user_sessions.delete_one({"session_token": token})
    return {"ok": True}

# ---------- SEED ----------
async def seed_user_data(user_id: str):
    """Seed demo emails, tasks, business profile if user has none yet."""
    await get_business_profile(user_id)

    email_count = await db.emails.count_documents({"user_id": user_id})
    if email_count == 0:
        now = datetime.now(timezone.utc)
        demo_emails = [
            EmailMessage(
                user_id=user_id,
                sender_name="Mikko Virtanen",
                sender_email="mikko.virtanen@example.com",
                subject="Tiedustelu BMW X5 -tuonnista",
                body="Hei,\n\nNäin sivuillanne että tuotte BMW-malleja Saksasta. Kiinnostaisi BMW X5 2022 vuosimalli, diesel. Mitä kokonaiskustannus olisi suunnilleen rekisteröitynä Suomeen? Onko teillä tällä hetkellä saatavilla tällaista autoa?\n\nTerveisin,\nMikko",
                received_at=now - timedelta(minutes=12),
                source="caars_web_form",
            ),
            EmailMessage(
                user_id=user_id,
                sender_name="Anna Korhonen",
                sender_email="anna.k@gmail.com",
                subject="Audi A6 - paljonko menee autoveroa?",
                body="Moi,\n\nKatselin teidän nettisivuilta Audi A6 2021 mallia. Voisitteko avata vähän mitä autovero tällaisesta autosta tulisi ja onko hinnassa kaikki kulut mukaan?\n\nKiitos,\nAnna",
                received_at=now - timedelta(hours=1),
                source="caars_web_form",
            ),
            EmailMessage(
                user_id=user_id,
                sender_name="Jukka Lehtinen",
                sender_email="jukka.lehtinen@yritys.fi",
                subject="Mercedes-Benz GLE - aikataulu?",
                body="Hei,\n\nOlin yhteydessä viikko sitten Mercedes-Benz GLE:stä. Miten projekti etenee? Onko jo tietoa toimitusaikataulusta?\n\nT. Jukka",
                received_at=now - timedelta(hours=3),
                category="customer_existing",
                is_first_email=False,
            ),
            EmailMessage(
                user_id=user_id,
                sender_name="Verohallinto",
                sender_email="noreply@vero.fi",
                subject="Ilmoituksenne on käsitelty",
                body="Tämä on automaattinen viesti. Ilmoituksenne on vastaanotettu.",
                received_at=now - timedelta(hours=5),
                category="internal",
            ),
        ]
        for em in demo_emails:
            await db.emails.insert_one(em.dict())

    task_count = await db.tasks.count_documents({"user_id": user_id})
    if task_count == 0:
        now = datetime.now(timezone.utc)
        demo_tasks = [
            Task(user_id=user_id, title="Soita Mikolle BMW X5 -tarjouksesta",
                 description="Liidiin vastaaminen puhelimitse",
                 due_at=now + timedelta(hours=2), source="email"),
            Task(user_id=user_id, title="Audi A6 katsastus",
                 description="Katsastusaika varattu",
                 due_at=now + timedelta(hours=5), source="calendar",
                 location="K1-katsastus, Helsinki"),
            Task(user_id=user_id, title="Lähetä autoveroilmoitus Traficomille",
                 description="Mercedes-Benz GLE rekisteröinti",
                 due_at=now + timedelta(days=1), source="manual"),
            Task(user_id=user_id, title="Asiakastapaaminen - Lehtinen",
                 description="GLE luovutus",
                 due_at=now + timedelta(days=2, hours=3), source="calendar",
                 location="CAARS-toimipiste"),
        ]
        for t in demo_tasks:
            await db.tasks.insert_one(t.dict())

# ---------- EMAILS ----------
@api_router.get("/emails")
async def list_emails(authorization: Optional[str] = Header(default=None),
                       status: Optional[str] = None):
    user = await get_user_from_token(authorization)
    query = {"user_id": user.user_id}
    if status:
        query["status"] = status
    cursor = db.emails.find(query, {"_id": 0}).sort("received_at", -1)
    items = await cursor.to_list(200)
    return {"items": items}

@api_router.post("/emails/{email_id}/generate-reply")
async def generate_reply(email_id: str,
                          payload: Optional[dict] = None,
                          authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    email_doc = await db.emails.find_one({"email_id": email_id, "user_id": user.user_id}, {"_id": 0})
    if not email_doc:
        raise HTTPException(status_code=404, detail="Email not found")
    profile = await get_business_profile(user.user_id)

    rules_cursor = db.auto_reply_rules.find({"user_id": user.user_id, "enabled": True}, {"_id": 0})
    rules = await rules_cursor.to_list(100)
    rules_text = "\n".join([f"- {r['name']}: {r['instruction']}" for r in rules]) or "Ei erillisiä sääntöjä."

    feedback = (payload or {}).get("feedback", "").strip() if payload else ""
    current_draft = (payload or {}).get("current_draft", "").strip() if payload else ""
    save_as_rule = bool((payload or {}).get("save_as_rule")) if payload else False

    # If user wants to save this feedback as a permanent rule, append to knowledge
    if save_as_rule and feedback:
        new_knowledge = (profile.knowledge or "") + f"\n\nLisäohje: {feedback}"
        await db.business_profiles.update_one(
            {"user_id": user.user_id},
            {"$set": {"knowledge": new_knowledge, "updated_at": datetime.now(timezone.utc)}},
        )
        profile.knowledge = new_knowledge

    system = f"""Olet henkilökohtainen sähköpostiavustaja yrittäjälle.
Yrityksen tiedot:
- Nimi: {profile.company_name}
- Yrittäjä: {profile.owner_name}
- Liiketoiminta: {profile.company_description}

Tieto-osaaminen:
{profile.knowledge}

Sävy: {profile.tone}

Erityisohjeet:
{rules_text}

Allekirjoitus käytä lopuksi:
{profile.signature.replace('{owner_name}', profile.owner_name)}

Vastaa AINA suomeksi. Pidä vastaus tiivinä, asiakaspalvelumaisena ja konkreettisena. Jos asiakkaalta puuttuu tieto (esim. vuosimalli, budjetti), kysy se kohteliaasti.
"""

    if feedback and current_draft:
        user_msg = f"""Asiakas: {email_doc['sender_name']} <{email_doc['sender_email']}>
Aihe: {email_doc['subject']}

Asiakkaan viesti:
{email_doc['body']}

Nykyinen vastausluonnoksesi:
\"\"\"
{current_draft}
\"\"\"

Yrittäjän palaute miten haluaa vastausta muutettavan:
\"\"\"
{feedback}
\"\"\"

Tehtäväsi: muokkaa nykyistä luonnosta yrittäjän palautteen mukaan. Säilytä asia mutta hio tyyliä/sisältöä palautteen mukaan. Palauta VAIN uusi vastausluonnos (ei selityksiä)."""
    elif feedback:
        user_msg = f"""Asiakas: {email_doc['sender_name']} <{email_doc['sender_email']}>
Aihe: {email_doc['subject']}
Lähde: {email_doc.get('source', 'gmail')}

Viesti:
{email_doc['body']}

Yrittäjän erityisohje tähän vastaukseen:
{feedback}

Kirjoita ammattimainen vastausluonnos."""
    else:
        user_msg = f"""Asiakas: {email_doc['sender_name']} <{email_doc['sender_email']}>
Aihe: {email_doc['subject']}
Lähde: {email_doc.get('source', 'gmail')}

Viesti:
{email_doc['body']}

Kirjoita ammattimainen vastausluonnos."""

    response = await llm_chat(system, user_msg)

    await db.emails.update_one(
        {"email_id": email_id},
        {"$set": {"suggested_reply": response, "final_reply": response}},
    )
    return {"suggested_reply": response, "saved_as_rule": save_as_rule}

class ReplyUpdate(BaseModel):
    final_reply: str

@api_router.patch("/emails/{email_id}/reply")
async def update_reply(email_id: str, payload: ReplyUpdate,
                       authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    res = await db.emails.update_one(
        {"email_id": email_id, "user_id": user.user_id},
        {"$set": {"final_reply": payload.final_reply}},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}

@api_router.post("/emails/{email_id}/approve")
async def approve_email(email_id: str, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    email_doc = await db.emails.find_one(
        {"email_id": email_id, "user_id": user.user_id}, {"_id": 0}
    )
    if not email_doc:
        raise HTTPException(status_code=404, detail="Not found")

    reply_text = email_doc.get("final_reply") or email_doc.get("suggested_reply") or ""
    if not reply_text.strip():
        raise HTTPException(status_code=400, detail="Vastausta ei ole")

    # If Gmail is connected and this email has a gmail thread, actually send via Gmail
    sent_via_gmail = False
    tokens = await db.google_tokens_email.find_one({"user_id": user.user_id}, {"_id": 0})
    if tokens and email_doc.get("gmail_message_id"):
        subject = email_doc["subject"]
        if not subject.lower().startswith("re:"):
            subject = f"Re: {subject}"
        sent_via_gmail = await send_via_gmail(
            user_id=user.user_id,
            to_email=email_doc["sender_email"],
            subject=subject,
            body=reply_text,
            in_reply_to_message_id=email_doc.get("gmail_message_id"),
            thread_id=email_doc.get("gmail_thread_id"),
        )

    await db.emails.update_one(
        {"email_id": email_id, "user_id": user.user_id},
        {"$set": {
            "status": "sent",
            "sent_at": datetime.now(timezone.utc),
            "sent_via_gmail": sent_via_gmail,
        }},
    )
    return {"ok": True, "sent_via_gmail": sent_via_gmail}

@api_router.post("/emails/{email_id}/auto-reply")
async def auto_reply_email(email_id: str, authorization: Optional[str] = Header(default=None)):
    """Generate reply AND send immediately — called from dashboard 'Botti vastaa' button."""
    user = await get_user_from_token(authorization)
    email_doc = await db.emails.find_one({"email_id": email_id, "user_id": user.user_id}, {"_id": 0})
    if not email_doc:
        raise HTTPException(status_code=404, detail="Not found")
    tokens = await db.google_tokens_email.find_one({"user_id": user.user_id}, {"_id": 0})
    await _internal_generate_and_send(user.user_id, email_doc, tokens or {})
    updated = await db.emails.find_one({"email_id": email_id}, {"_id": 0})
    return {"ok": True, "suggested_reply": (updated or {}).get("suggested_reply", ""), "status": (updated or {}).get("status")}

@api_router.post("/emails/{email_id}/skip")
async def skip_email(email_id: str, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    await db.emails.update_one(
        {"email_id": email_id, "user_id": user.user_id},
        {"$set": {"status": "skipped"}},
    )
    return {"ok": True}

# ---------- TASKS ----------
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_at: datetime
    location: Optional[str] = None
    source: Literal["calendar", "manual", "email"] = "manual"

@api_router.get("/tasks")
async def list_tasks(authorization: Optional[str] = Header(default=None),
                      scope: Optional[str] = "all"):
    user = await get_user_from_token(authorization)
    query = {"user_id": user.user_id}
    now = datetime.now(timezone.utc)
    if scope == "today":
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end = start + timedelta(days=1)
        query["due_at"] = {"$gte": start, "$lt": end}
    elif scope == "upcoming":
        query["due_at"] = {"$gte": now}
    cursor = db.tasks.find(query, {"_id": 0}).sort("due_at", 1)
    items = await cursor.to_list(200)
    return {"items": items}

@api_router.post("/tasks")
async def create_task(payload: TaskCreate, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    task = Task(user_id=user.user_id, **payload.dict())
    await db.tasks.insert_one(task.dict())
    return task.dict()

class TaskUpdate(BaseModel):
    completed: Optional[bool] = None
    title: Optional[str] = None
    due_at: Optional[datetime] = None

@api_router.patch("/tasks/{task_id}")
async def update_task(task_id: str, payload: TaskUpdate,
                       authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    update = {k: v for k, v in payload.dict().items() if v is not None}
    if not update:
        return {"ok": True}
    res = await db.tasks.update_one(
        {"task_id": task_id, "user_id": user.user_id},
        {"$set": update},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}

@api_router.delete("/tasks/{task_id}")
async def delete_task(task_id: str, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    await db.tasks.delete_one({"task_id": task_id, "user_id": user.user_id})
    return {"ok": True}

# ---------- BUSINESS PROFILE ----------
class Brand(BaseModel):
    brand_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # display name, e.g. "CAARS.fi"
    company_name: str = ""
    company_description: str = ""
    tone: str = "Ammatillinen, ystävällinen, suomeksi."
    signature: str = ""
    knowledge: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BusinessProfileUpdate(BaseModel):
    owner_name: Optional[str] = None
    company_name: Optional[str] = None
    company_description: Optional[str] = None
    tone: Optional[str] = None
    signature: Optional[str] = None
    knowledge: Optional[str] = None

@api_router.get("/business-profile")
async def get_profile(authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    profile = await get_business_profile(user.user_id)
    return profile.dict()

@api_router.put("/business-profile")
async def update_profile(payload: BusinessProfileUpdate,
                          authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    update = {k: v for k, v in payload.dict().items() if v is not None}
    update["updated_at"] = datetime.now(timezone.utc)
    await db.business_profiles.update_one(
        {"user_id": user.user_id},
        {"$set": update},
        upsert=True,
    )
    profile = await get_business_profile(user.user_id)
    return profile.dict()

# ---------- BRANDS ----------
@api_router.get("/business-profile/brands")
async def list_brands(authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    doc = await db.business_profiles.find_one({"user_id": user.user_id}, {"_id": 0, "brands": 1})
    brands = doc.get("brands", []) if doc else []
    return {"brands": brands}

@api_router.post("/business-profile/brands")
async def create_brand(payload: Brand, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    brand = Brand(**payload.dict())
    brand.brand_id = str(uuid.uuid4())
    await db.business_profiles.update_one(
        {"user_id": user.user_id},
        {"$push": {"brands": brand.dict()}},
        upsert=True,
    )
    return brand.dict()

@api_router.put("/business-profile/brands/{brand_id}")
async def update_brand(brand_id: str, payload: Brand,
                       authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    update_fields = {f"brands.$.{k}": v for k, v in payload.dict(exclude={"brand_id", "created_at"}).items()}
    await db.business_profiles.update_one(
        {"user_id": user.user_id, "brands.brand_id": brand_id},
        {"$set": update_fields},
    )
    return {"ok": True}

@api_router.delete("/business-profile/brands/{brand_id}")
async def delete_brand(brand_id: str, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    await db.business_profiles.update_one(
        {"user_id": user.user_id},
        {"$pull": {"brands": {"brand_id": brand_id}}},
    )
    return {"ok": True}

# ---------- CAARS.FI SCRAPE ----------
@api_router.post("/scrape/caars")
async def scrape_caars(authorization: Optional[str] = Header(default=None)):
    """Fetch caars.fi and store extracted text as business knowledge."""
    user = await get_user_from_token(authorization)
    import re as _re2
    urls = ["https://caars.fi", "https://www.caars.fi"]
    content_parts = []
    async with httpx.AsyncClient(timeout=20.0, follow_redirects=True) as hx:
        for url in urls:
            try:
                r = await hx.get(url, headers={"User-Agent": "Mozilla/5.0 (compatible; CaarsBot/1.0)"})
                if r.status_code == 200:
                    html = r.text
                    text = _re2.sub(r"<script[^>]*>[\s\S]*?</script>", "", html, flags=_re2.IGNORECASE)
                    text = _re2.sub(r"<style[^>]*>[\s\S]*?</style>", "", text, flags=_re2.IGNORECASE)
                    text = _re2.sub(r"<[^>]+>", " ", text)
                    text = _re2.sub(r"\s{3,}", "\n", text).strip()
                    if len(text) > 200:
                        content_parts.append(text[:4000])
                        break
            except Exception:
                continue
    if not content_parts:
        raise HTTPException(status_code=502, detail="caars.fi ei vastannut tai sisältö tyhjä")
    scraped = "\n\n".join(content_parts)
    summary_resp = await llm_chat(
        "Olet tiedonpoimija. Saat caars.fi-sivuston tekstisisällön. Tiivistä se 500 sanan selkeäksi kuvaukseksi siitä, mitä Caars.fi-yritys tekee: palvelut, prosessi, automerkit, kohderyhmät, hinnoittelu. Suomeksi.",
        scraped[:8000],
    )
    profile = await get_business_profile(user.user_id)
    marker = "\n\n[Caars.fi-sivusto haettu automaattisesti]"
    new_knowledge = (profile.knowledge or "").split(marker)[0].strip() + marker + "\n" + summary_resp
    await db.business_profiles.update_one(
        {"user_id": user.user_id},
        {"$set": {"knowledge": new_knowledge, "updated_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    return {"ok": True, "summary": summary_resp}


# ---------- AUTO-REPLY RULES ----------
class RuleCreate(BaseModel):
    name: str
    instruction: str
    trigger_keywords: List[str] = []
    trigger_sender_contains: Optional[str] = None
    enabled: bool = True

@api_router.get("/auto-reply-rules")
async def list_rules(authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    cursor = db.auto_reply_rules.find({"user_id": user.user_id}, {"_id": 0}).sort("created_at", -1)
    items = await cursor.to_list(200)
    return {"items": items}

@api_router.post("/auto-reply-rules")
async def create_rule(payload: RuleCreate, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    rule = AutoReplyRule(user_id=user.user_id, **payload.dict())
    await db.auto_reply_rules.insert_one(rule.dict())
    return rule.dict()

@api_router.delete("/auto-reply-rules/{rule_id}")
async def delete_rule(rule_id: str, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    await db.auto_reply_rules.delete_one({"rule_id": rule_id, "user_id": user.user_id})
    return {"ok": True}

# ---------- REPLY TEMPLATES ----------
class TemplateCreate(BaseModel):
    name: str
    trigger_description: str = ""
    template_text: str
    enabled: bool = True

@api_router.get("/reply-templates")
async def list_templates(authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    cursor = db.reply_templates.find({"user_id": user.user_id}, {"_id": 0}).sort("created_at", 1)
    items = await cursor.to_list(50)
    return {"items": items}

@api_router.post("/reply-templates")
async def create_template(payload: TemplateCreate, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    tmpl = ReplyTemplate(user_id=user.user_id, **payload.dict())
    await db.reply_templates.insert_one(tmpl.dict())
    return {k: v for k, v in tmpl.dict().items() if k != "user_id"}

@api_router.put("/reply-templates/{template_id}")
async def update_template(template_id: str, payload: TemplateCreate,
                          authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    await db.reply_templates.update_one(
        {"template_id": template_id, "user_id": user.user_id},
        {"$set": payload.dict()},
    )
    return {"ok": True}

@api_router.delete("/reply-templates/{template_id}")
async def delete_template(template_id: str, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    await db.reply_templates.delete_one({"template_id": template_id, "user_id": user.user_id})
    return {"ok": True}

# ---------- ASSISTANT CHAT ----------
import re as _re
import json as _json


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


ACTION_RE = _re.compile(r'```action\s*(\{[\s\S]*?\})\s*```', _re.DOTALL)


def _extract_action(text: str):
    m = ACTION_RE.search(text)
    if not m:
        return text, None
    try:
        action = _json.loads(m.group(1))
        clean = ACTION_RE.sub("", text).strip()
        return clean, action
    except Exception:
        return text, None


TOOLS_CONNECTED = """1. **gmail_search** — Etsi sähköposteja Gmailista. Näyttää listan käyttäjälle.
   ```action
   {"type": "gmail_search", "query": "from:calendly.com newer_than:30d", "label": "Calendly-viestit"}
   ```

2. **gmail_trash** — Siirtää hakukyselyn osumat roskakoriin. Käyttäjä vahvistaa ennen suoritusta.
   ```action
   {"type": "gmail_trash", "query": "from:calendly.com", "label": "Calendly-viestit"}
   ```

3. **gmail_label** — Lisää label (Gmailin "kansio") hakukyselyn osumille. Jos labelia ei ole, luo se. Voit myös arkistoida (poistaa Inboxista) samalla kun lisäät labelin, käyttämällä `archive: true`.
   ```action
   {"type": "gmail_label", "query": "from:jorma.kittila@example.com", "label_name": "Jorma Kittilä", "archive": true}
   ```

4. **gmail_archive** — Arkistoi (poistaa Inboxista, säilyttää viestit) hakukyselyn osumat.
   ```action
   {"type": "gmail_archive", "query": "from:newsletter@", "label": "Newsletter"}
   ```

5. **gmail_mark_read** — Merkitse hakukyselyn osumat luetuiksi.
   ```action
   {"type": "gmail_mark_read", "query": "is:unread newer_than:7d", "label": "Vanhat lukemattomat"}
   ```

6. **calendar_list** — Listaa kalenteritapahtumat. Tukee sekä tulevia että menneitä tapahtumia.
   - Tulevat tapahtumat: `{"type": "calendar_list", "days": 7}`
   - Menneet tapahtumat: `{"type": "calendar_list", "days": 0, "days_back": 30}`
   - Molemmat suunnat: `{"type": "calendar_list", "days": 7, "days_back": 30}`
   ```action
   {"type": "calendar_list", "days": 7, "days_back": 0}
   ```

7. **calendar_event_delete** (P) — Poista kalenteritapahtuma event_id:llä tai hakusanalla+päivämäärällä.
   ```action
   {"type": "calendar_event_delete", "event_id": "abc123", "summary": "Palaveri"}
   ```
   TAI haulla: `{"type": "calendar_event_delete", "query": "Palaveri", "date": "2026-06-26"}`

8. **calendar_event_move** (T/H/F/1-5) — Siirrä tapahtumaa päivillä eteenpäin (tai absoluuttisesti).
   - T = tänään (days=0, move_to_today=true)
   - H = huomenna (days=1)
   - F = viikko eteenpäin (days=7)
   - 1-5 = N päivää eteenpäin
   ```action
   {"type": "calendar_event_move", "event_id": "abc123", "days": 1, "summary": "Palaveri"}
   ```
   TAI haulla: `{"type": "calendar_event_move", "query": "Palaveri", "date": "2026-06-26", "days": 7}`

9. **create_task** — Luo uusi tehtävä. due_at ISO-muodossa UTC:nä.
   ```action
   {"type": "create_task", "title": "Soita asiakkaalle", "due_at": "2026-06-22T10:00:00Z", "description": ""}
   ```
"""

TOOLS_DISCONNECTED = """1. **create_task** — Luo uusi tehtävä.
   ```action
   {"type": "create_task", "title": "...", "due_at": "2026-06-22T10:00:00Z"}
   ```

HUOM: Käyttäjä EI ole yhdistänyt Gmailia/Calendaria. Älä ehdota gmail_-tai calendar_-työkaluja. Ohjaa käyttäjä Asetukset-välilehdelle yhdistämään Google-tili.
"""


@api_router.get("/assistant/messages")
async def list_messages(authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    cursor = db.chat_messages.find({"user_id": user.user_id}, {"_id": 0}).sort("created_at", 1)
    items = await cursor.to_list(500)
    return {"items": items}


@api_router.post("/assistant/chat")
async def chat_with_assistant(payload: ChatRequest,
                               authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    profile = await get_business_profile(user.user_id)
    google_connected = (
        await db.google_tokens_email.find_one({"user_id": user.user_id}, {"_id": 0}) is not None
        or await db.google_tokens_calendar.find_one({"user_id": user.user_id}, {"_id": 0}) is not None
    )

    # Brands context
    profile_doc = await db.business_profiles.find_one({"user_id": user.user_id}, {"_id": 0, "brands": 1})
    brands: list = profile_doc.get("brands", []) if profile_doc else []
    brands_str = ""
    if brands:
        brands_str = "\n\nMUUT BRÄNDIT / YRITYKSET:\n"
        for b in brands:
            brands_str += f"\n--- {b.get('name', b.get('company_name', ''))} ---\n"
            if b.get("company_description"):
                brands_str += f"Kuvaus: {b['company_description']}\n"
            if b.get("knowledge"):
                brands_str += f"Tietämys: {b['knowledge']}\n"
            if b.get("tone"):
                brands_str += f"Sävy: {b['tone']}\n"

    # Reply templates
    templates_cursor = db.reply_templates.find(
        {"user_id": user.user_id, "enabled": True}, {"_id": 0}
    ).sort("created_at", 1)
    templates = await templates_cursor.to_list(20)
    templates_str = ""
    if templates:
        templates_str = "\n\nVASTAUSMALLIPOHJAT (käytä näitä kun generoit sähköpostivastausta):\n"
        for t in templates:
            templates_str += f"\n### {t['name']}"
            if t.get("trigger_description"):
                templates_str += f" — KÄYTÄ KUN: {t['trigger_description']}"
            templates_str += f"\n{t['template_text']}\n"

    # Recent context
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    upcoming = await db.tasks.find(
        {"user_id": user.user_id, "due_at": {"$gte": today_start}, "completed": False},
        {"_id": 0},
    ).sort("due_at", 1).to_list(10)
    pending_emails = await db.emails.count_documents(
        {"user_id": user.user_id, "status": "needs_review"}
    )
    upcoming_str = "\n".join([
        f"- {t['title']} ({t['due_at']})" for t in upcoming
    ]) or "Ei tulevia tehtäviä."

    tools_section = TOOLS_CONNECTED if google_connected else TOOLS_DISCONNECTED
    google_status = "Yhdistetty (Gmail + Calendar käytettävissä)" if google_connected else "EI yhdistetty"

    system = f"""Olet henkilökohtainen yrittäjäavustaja yritykselle {profile.company_name}.
Yrittäjä: {profile.owner_name}.

Yrityksen kuvaus:
{profile.company_description}
{brands_str}
Tietämys:
{profile.knowledge}
{templates_str}
Tämänhetkinen tilanne:
- Tulossa olevat tehtävät:
{upcoming_str}
- Vastausta odottavia sähköposteja: {pending_emails}
- Google-yhteys: {google_status}

KÄYTETTÄVISSÄ OLEVAT TYÖKALUT:
{tools_section}

TYÖKALUJEN KÄYTTÖ:
- Kun käyttäjä pyytää konkreettista toimenpidettä (etsi/poista viestejä, listaa kalenteri, luo tehtävä), kirjoita lyhyt vahvistus suomeksi mitä aiot tehdä ja LIITÄ PERÄÄN yksi action-koodilohko.
- Käyttäjä näkee vahvistuskortin ja painaa "Vahvista" jotta toiminto suoritetaan. Sinun ei tarvitse pyytää vahvistusta erikseen tekstissä.
- Jos käyttäjä pyytää vain tietoa tai keskustelee, vastaa normaalisti ILMAN action-blokkia.
- Älä keksi työkaluja jotka eivät ole listassa.

GMAIL-HAUN OHJEET (kriittinen):
- Käytä yksinkertaisia, laajoja hakukyselyitä — Gmail osaa pari-osumat hyvin.
- **ÄLÄ KOSKAAN ARVAA SÄHKÖPOSTIOSOITTEITA.** Jos käyttäjä mainitsee henkilön nimen, käytä pelkkää etunimeä: `from:jorma` ei `from:jorma.kittila@example.com`. Gmail etsii `from:`-operaattorilla SEKÄ nimestä että osoitteesta.
- Esimerkit oikeista kyselyistä:
  - "Jorma" -nimeltä → `from:jorma`
  - "Kalle Mikkonen" -nimeltä → `from:kalle` tai `from:mikkonen`
  - Sähköposti tietystä firmasta → `from:@firmanimi.fi`
  - Calendly-viestit → `from:calendly.com`
  - Uutiskirjeet → `(category:promotions OR unsubscribe OR uutiskirje OR newsletter)`
  - Lasku-viestit → `subject:lasku OR subject:invoice`
- Lisää tarvittaessa `in:anywhere` (haku myös arkistoiduista) tai `newer_than:90d` (vain viime 3 kk).
- Gmail-haun operaattorit: `from:`, `to:`, `subject:`, `has:attachment`, `is:unread`, `is:read`, `newer_than:7d`, `older_than:1y`, `label:`, `category:`, `in:inbox`, `in:anywhere`.
- Älä lisää ylimääräisiä lainausmerkkejä `from:`-operaattoriin.

KALENTERIN LYHENTEET (kun käyttäjä mainitsee näitä):
- **P** = Poista kalenterimerkintä (calendar_event_delete)
- **T** = Siirrä tähän päivään (calendar_event_move, move_to_today=true)
- **H** = Siirrä huomiselle (calendar_event_move, days=1)
- **F** = Siirrä viikkoa eteenpäin samalle viikonpäivälle (calendar_event_move, days=7)
- **1/2/3/4/5** = Siirrä N päivää eteenpäin (calendar_event_move, days=N)

Esimerkki: "P palaveri 26.6" → etsi tapahtuma nimeltä "palaveri" päivältä 26.6 ja poista se.
Esimerkki: "H palaveri" → siirrä "palaveri"-niminen tapahtuma huomiselle.
Jos event_id on tiedossa (calendar_list antoi sen), käytä sitä. Muuten käytä query+date.

Vastaa AINA suomeksi. Pidä vastaukset tiiviinä."""

    user_text = payload.message

    # Load last 20 messages as history (Claude requires strict user/assistant alternation)
    history_cursor = db.chat_messages.find(
        {"user_id": user.user_id},
        {"_id": 0, "role": 1, "content": 1}
    ).sort("created_at", -1).limit(20)
    history_raw = await history_cursor.to_list(20)
    history_raw.reverse()
    # Build alternating history — merge consecutive same-role messages
    history: list = []
    for h in history_raw:
        role = h.get("role")
        if role not in ("user", "assistant"):
            continue
        content = h.get("content", "")
        if history and history[-1]["role"] == role:
            history[-1]["content"] += "\n" + content
        else:
            history.append({"role": role, "content": content})
    # Must start with user message for Claude
    while history and history[0]["role"] != "user":
        history.pop(0)

    await db.chat_messages.insert_one(
        ChatMessage(user_id=user.user_id, role="user", content=user_text).dict()
    )

    response = await llm_chat(system, user_text, history=history)

    clean_text, action = _extract_action(response)
    if not clean_text and action:
        clean_text = "Voin tehdä tämän puolestasi — vahvista alta:"

    # Save assistant message with action attached
    msg_doc = ChatMessage(
        user_id=user.user_id, role="assistant", content=clean_text
    ).dict()
    if action:
        msg_doc["action"] = action
        msg_doc["action_state"] = "pending"
    await db.chat_messages.insert_one(msg_doc)

    return {"reply": clean_text, "action": action, "message_id": msg_doc["message_id"]}


class ExecuteActionRequest(BaseModel):
    message_id: Optional[str] = None
    action: dict


@api_router.post("/assistant/execute-action")
async def execute_action(payload: ExecuteActionRequest,
                          authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    action = payload.action
    action_type = action.get("type")
    result_text = ""

    if action_type in ("gmail_search", "gmail_trash", "gmail_label", "gmail_archive", "gmail_mark_read", "calendar_list"):
        tokens = await get_google_tokens(user.user_id)
        if not tokens:
            raise HTTPException(status_code=400, detail="Google ei kytketty")
        headers_auth = {"Authorization": f"Bearer {tokens['access_token']}"}

        async with httpx.AsyncClient(timeout=30.0) as hx:
            if action_type == "gmail_search":
                q = action.get("query", "")
                label = action.get("label", q)
                r = await hx.get(
                    f"{GMAIL_API}/messages",
                    params={"q": q, "maxResults": 20},
                    headers=headers_auth,
                )
                if r.status_code != 200:
                    raise HTTPException(status_code=500, detail=f"Gmail-haku epäonnistui: {r.text[:200]}")
                msgs = r.json().get("messages", [])
                if not msgs:
                    result_text = f"Ei löytynyt viestejä haulla `{q}`."
                else:
                    lines = []
                    for m in msgs[:10]:
                        m_resp = await hx.get(
                            f"{GMAIL_API}/messages/{m['id']}",
                            params={"format": "metadata", "metadataHeaders": ["From", "Subject", "Date"]},
                            headers=headers_auth,
                        )
                        if m_resp.status_code != 200:
                            continue
                        hh = m_resp.json().get("payload", {}).get("headers", [])
                        lines.append(f"• {_header(hh, 'From')} — {_header(hh, 'Subject')}")
                    suffix = f"\n\n…ja {len(msgs) - 10} muuta" if len(msgs) > 10 else ""
                    result_text = f"Löysin {len(msgs)} viestiä haulla `{q}`:\n\n" + "\n".join(lines) + suffix

            elif action_type == "gmail_trash":
                q = action.get("query", "")
                label = action.get("label", q)
                # Page through ids
                ids: List[str] = []
                page_token = None
                while True:
                    params = {"q": q, "maxResults": 500}
                    if page_token:
                        params["pageToken"] = page_token
                    r = await hx.get(
                        f"{GMAIL_API}/messages",
                        params=params,
                        headers=headers_auth,
                    )
                    if r.status_code != 200:
                        break
                    data = r.json()
                    for m in data.get("messages", []):
                        ids.append(m["id"])
                    page_token = data.get("nextPageToken")
                    if not page_token or len(ids) >= 1000:
                        break

                if not ids:
                    result_text = f"Ei löytynyt viestejä haulla `{q}` — ei poistettavaa."
                else:
                    # Batch trash (max 1000 per call, addLabelIds=TRASH)
                    chunk_size = 500
                    moved = 0
                    for i in range(0, len(ids), chunk_size):
                        chunk = ids[i:i + chunk_size]
                        bm = await hx.post(
                            f"{GMAIL_API}/messages/batchModify",
                            headers={**headers_auth, "Content-Type": "application/json"},
                            json={"ids": chunk, "addLabelIds": ["TRASH"], "removeLabelIds": ["INBOX"]},
                        )
                        if bm.status_code in (200, 204):
                            moved += len(chunk)
                    result_text = f"✓ Siirsin {moved} viestiä roskakoriin ({label})."

            elif action_type == "gmail_label":
                q = action.get("query", "")
                label_name = action.get("label_name", "").strip()
                archive = bool(action.get("archive", False))
                if not label_name:
                    raise HTTPException(status_code=400, detail="label_name puuttuu")

                # Find or create label
                labels_resp = await hx.get(f"{GMAIL_API}/labels", headers=headers_auth)
                label_id = None
                if labels_resp.status_code == 200:
                    for lab in labels_resp.json().get("labels", []):
                        if lab.get("name", "").lower() == label_name.lower():
                            label_id = lab["id"]
                            break
                if not label_id:
                    create_resp = await hx.post(
                        f"{GMAIL_API}/labels",
                        headers={**headers_auth, "Content-Type": "application/json"},
                        json={"name": label_name, "labelListVisibility": "labelShow",
                              "messageListVisibility": "show"},
                    )
                    if create_resp.status_code in (200, 201):
                        label_id = create_resp.json().get("id")
                    else:
                        raise HTTPException(status_code=500, detail=f"Labelin luonti epäonnistui: {create_resp.text[:200]}")

                # Find messages
                ids: List[str] = []
                page_token = None
                while True:
                    params = {"q": q, "maxResults": 500}
                    if page_token:
                        params["pageToken"] = page_token
                    r = await hx.get(f"{GMAIL_API}/messages", params=params, headers=headers_auth)
                    if r.status_code != 200:
                        break
                    data = r.json()
                    for m in data.get("messages", []):
                        ids.append(m["id"])
                    page_token = data.get("nextPageToken")
                    if not page_token or len(ids) >= 1000:
                        break

                if not ids:
                    result_text = f"Ei löytynyt viestejä haulla `{q}`.\n\n💡 Jos uskot että viestejä on, kokeile yksinkertaisempaa hakua avustajan kanssa, esim: \"Etsi viestit hakulauseella `from:jorma in:anywhere`\""
                else:
                    add = [label_id]
                    remove = ["INBOX"] if archive else []
                    moved = 0
                    for i in range(0, len(ids), 500):
                        chunk = ids[i:i + 500]
                        bm = await hx.post(
                            f"{GMAIL_API}/messages/batchModify",
                            headers={**headers_auth, "Content-Type": "application/json"},
                            json={"ids": chunk, "addLabelIds": add, "removeLabelIds": remove},
                        )
                        if bm.status_code in (200, 204):
                            moved += len(chunk)
                    extra = " ja arkistoitiin (poistettu Inboxista)" if archive else ""
                    result_text = f"✓ {moved} viestiä merkitty labelilla «{label_name}»{extra}.\nHaku: `{q}`"

            elif action_type == "gmail_archive":
                q = action.get("query", "")
                ids: List[str] = []
                page_token = None
                while True:
                    params = {"q": q, "maxResults": 500}
                    if page_token:
                        params["pageToken"] = page_token
                    r = await hx.get(f"{GMAIL_API}/messages", params=params, headers=headers_auth)
                    if r.status_code != 200:
                        break
                    data = r.json()
                    for m in data.get("messages", []):
                        ids.append(m["id"])
                    page_token = data.get("nextPageToken")
                    if not page_token or len(ids) >= 1000:
                        break
                if not ids:
                    result_text = f"Ei löytynyt viestejä haulla `{q}`."
                else:
                    archived = 0
                    for i in range(0, len(ids), 500):
                        chunk = ids[i:i + 500]
                        bm = await hx.post(
                            f"{GMAIL_API}/messages/batchModify",
                            headers={**headers_auth, "Content-Type": "application/json"},
                            json={"ids": chunk, "removeLabelIds": ["INBOX"]},
                        )
                        if bm.status_code in (200, 204):
                            archived += len(chunk)
                    result_text = f"✓ Arkistoitu {archived} viestiä (poistettu Inboxista, säilytetty Gmailissä)."

            elif action_type == "gmail_mark_read":
                q = action.get("query", "")
                ids: List[str] = []
                page_token = None
                while True:
                    params = {"q": q, "maxResults": 500}
                    if page_token:
                        params["pageToken"] = page_token
                    r = await hx.get(f"{GMAIL_API}/messages", params=params, headers=headers_auth)
                    if r.status_code != 200:
                        break
                    data = r.json()
                    for m in data.get("messages", []):
                        ids.append(m["id"])
                    page_token = data.get("nextPageToken")
                    if not page_token or len(ids) >= 1000:
                        break
                if not ids:
                    result_text = f"Ei löytynyt viestejä haulla `{q}`."
                else:
                    marked = 0
                    for i in range(0, len(ids), 500):
                        chunk = ids[i:i + 500]
                        bm = await hx.post(
                            f"{GMAIL_API}/messages/batchModify",
                            headers={**headers_auth, "Content-Type": "application/json"},
                            json={"ids": chunk, "removeLabelIds": ["UNREAD"]},
                        )
                        if bm.status_code in (200, 204):
                            marked += len(chunk)
                    result_text = f"✓ {marked} viestiä merkitty luetuiksi."

            elif action_type == "calendar_list":
                days = int(action.get("days", 7))
                days_back = int(action.get("days_back", 0))
                start_dt = datetime.now(timezone.utc) - timedelta(days=days_back)
                end_dt = datetime.now(timezone.utc) + timedelta(days=days)
                start_iso = start_dt.isoformat().replace("+00:00", "Z")
                end_iso = end_dt.isoformat().replace("+00:00", "Z")
                r = await hx.get(
                    f"{CALENDAR_API}/calendars/primary/events",
                    params={"timeMin": start_iso, "timeMax": end_iso, "singleEvents": "true", "orderBy": "startTime", "maxResults": 50},
                    headers=headers_auth,
                )
                if r.status_code != 200:
                    raise HTTPException(status_code=500, detail=f"Kalenteri-haku epäonnistui: {r.text[:200]}")
                events = r.json().get("items", [])
                period_label = f"edellinen {days_back} + seuraavat {days} päivää" if days_back else f"seuraavat {days} päivää"
                if not events:
                    result_text = f"Ei tapahtumia ajanjaksolla: {period_label}."
                else:
                    lines = []
                    for e in events:
                        start = e.get("start", {}).get("dateTime") or e.get("start", {}).get("date", "")
                        title = e.get("summary", "(nimetön)")
                        loc = e.get("location", "")
                        eid = e.get("id", "")
                        lines.append(f"• [{eid}] {start} — {title}" + (f" @ {loc}" if loc else ""))
                    result_text = f"Kalenteri — {period_label} ({len(events)} tapahtumaa):\n\n" + "\n".join(lines)

    elif action_type in ("calendar_event_delete", "calendar_event_move"):
        cal_tokens = await get_calendar_tokens(user.user_id) or await get_email_tokens(user.user_id)
        if not cal_tokens:
            raise HTTPException(status_code=400, detail="Kalenteri ei yhdistetty")
        headers_auth = {"Authorization": f"Bearer {cal_tokens['access_token']}"}
        event_id = action.get("event_id")
        query = action.get("query", "")
        date_str = action.get("date", "")

        async with httpx.AsyncClient(timeout=20.0) as hx:
            # If no event_id provided, search by query/date
            if not event_id:
                search_params: dict = {"singleEvents": "true", "orderBy": "startTime", "maxResults": 10, "q": query}
                if date_str:
                    try:
                        d = datetime.fromisoformat(date_str)
                        search_params["timeMin"] = d.replace(hour=0, minute=0, second=0, tzinfo=timezone.utc).isoformat().replace("+00:00", "Z")
                        search_params["timeMax"] = (d.replace(hour=23, minute=59, second=59, tzinfo=timezone.utc)).isoformat().replace("+00:00", "Z")
                    except Exception:
                        # Search ±30 days
                        search_params["timeMin"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
                        search_params["timeMax"] = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat().replace("+00:00", "Z")
                else:
                    search_params["timeMin"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
                    search_params["timeMax"] = (datetime.now(timezone.utc) + timedelta(days=365)).isoformat().replace("+00:00", "Z")
                sr = await hx.get(f"{CALENDAR_API}/calendars/primary/events", params=search_params, headers=headers_auth)
                if sr.status_code == 200:
                    found = sr.json().get("items", [])
                    if found:
                        event_id = found[0]["id"]
                        action["summary"] = found[0].get("summary", query)

            if not event_id:
                result_text = f"Ei löydetty tapahtumaa haulla '{query}'."
            elif action_type == "calendar_event_delete":
                dr = await hx.delete(f"{CALENDAR_API}/calendars/primary/events/{event_id}", headers=headers_auth)
                label = action.get("summary", event_id)
                result_text = f"✓ Tapahtuma poistettu: «{label}»." if dr.status_code in (200, 204) else f"Poisto epäonnistui ({dr.status_code})."
            else:  # calendar_event_move
                days = int(action.get("days", 1))
                move_to_today = bool(action.get("move_to_today"))
                gr = await hx.get(f"{CALENDAR_API}/calendars/primary/events/{event_id}", headers=headers_auth)
                if gr.status_code != 200:
                    result_text = f"Tapahtumaa ei löydy ID:llä {event_id}."
                else:
                    ev = gr.json()
                    start = ev.get("start", {})
                    end = ev.get("end", {})
                    # Determine duration
                    if start.get("dateTime"):
                        s_dt = datetime.fromisoformat(start["dateTime"].replace("Z", "+00:00"))
                        e_dt = datetime.fromisoformat(end["dateTime"].replace("Z", "+00:00"))
                        duration = e_dt - s_dt
                        if move_to_today:
                            today = datetime.now(timezone.utc).replace(hour=s_dt.hour, minute=s_dt.minute, second=0)
                            new_s = today
                        else:
                            new_s = s_dt + timedelta(days=days)
                        new_e = new_s + duration
                        patch = {"start": {"dateTime": new_s.isoformat(), "timeZone": start.get("timeZone", "Europe/Helsinki")},
                                 "end": {"dateTime": new_e.isoformat(), "timeZone": end.get("timeZone", "Europe/Helsinki")}}
                    else:
                        s_date = datetime.fromisoformat(start["date"])
                        e_date = datetime.fromisoformat(end["date"])
                        duration_days = (e_date - s_date).days
                        if move_to_today:
                            new_s_date = datetime.now(timezone.utc).date()
                        else:
                            new_s_date = s_date.date() + timedelta(days=days)
                        new_e_date = new_s_date + timedelta(days=duration_days)
                        patch = {"start": {"date": new_s_date.isoformat()}, "end": {"date": new_e_date.isoformat()}}
                    pr = await hx.patch(
                        f"{CALENDAR_API}/calendars/primary/events/{event_id}",
                        headers={**headers_auth, "Content-Type": "application/json"},
                        json=patch,
                    )
                    label = action.get("summary", ev.get("summary", event_id))
                    if pr.status_code == 200:
                        new_start = patch.get("start", {}).get("dateTime") or patch.get("start", {}).get("date", "")
                        result_text = f"✓ Tapahtuma «{label}» siirretty → {new_start[:10]}."
                    else:
                        result_text = f"Siirto epäonnistui ({pr.status_code})."

    elif action_type == "create_task":
        try:
            due_at = datetime.fromisoformat(action["due_at"].replace("Z", "+00:00"))
            if due_at.tzinfo is None:
                due_at = due_at.replace(tzinfo=timezone.utc)
        except Exception:
            raise HTTPException(status_code=400, detail="Virheellinen due_at")
        new_task = Task(
            user_id=user.user_id,
            title=action.get("title", "Tehtävä"),
            description=action.get("description"),
            due_at=due_at,
            source="manual",
        )
        await db.tasks.insert_one(new_task.dict())
        result_text = f"✓ Tehtävä luotu: «{new_task.title}» ({due_at.strftime('%d.%m.%Y %H:%M')})."

    else:
        raise HTTPException(status_code=400, detail=f"Tuntematon toiminto: {action_type}")

    # Update original message action state + save result as new assistant message
    if payload.message_id:
        await db.chat_messages.update_one(
            {"user_id": user.user_id, "message_id": payload.message_id},
            {"$set": {"action_state": "executed"}},
        )
    result_msg = ChatMessage(
        user_id=user.user_id, role="assistant", content=result_text
    ).dict()
    result_msg["is_action_result"] = True
    await db.chat_messages.insert_one(result_msg)

    return {"result": result_text, "message_id": result_msg["message_id"]}


class CancelActionRequest(BaseModel):
    message_id: str


@api_router.post("/assistant/cancel-action")
async def cancel_action(payload: CancelActionRequest,
                         authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    await db.chat_messages.update_one(
        {"user_id": user.user_id, "message_id": payload.message_id},
        {"$set": {"action_state": "cancelled"}},
    )
    return {"ok": True}


@api_router.delete("/assistant/messages")
async def clear_messages(authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    await db.chat_messages.delete_many({"user_id": user.user_id})
    return {"ok": True}

# ---------- DASHBOARD SUMMARY ----------
@api_router.get("/dashboard/summary")
async def dashboard_summary(authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)

    today_tasks = await db.tasks.find(
        {"user_id": user.user_id, "due_at": {"$gte": today_start, "$lt": today_end}},
        {"_id": 0},
    ).sort("due_at", 1).to_list(50)

    overdue = await db.tasks.find(
        {"user_id": user.user_id, "due_at": {"$lt": now}, "completed": False},
        {"_id": 0},
    ).sort("due_at", 1).to_list(50)

    pending_emails = await db.emails.find(
        {"user_id": user.user_id, "status": "needs_review", "category": {"$in": ["customer_lead", "customer_existing"]}},
        {"_id": 0},
    ).sort("received_at", -1).to_list(10)

    return {
        "today_tasks": today_tasks,
        "overdue_tasks": overdue,
        "pending_emails": pending_emails,
        "now": now.isoformat(),
    }

# ---------- HEALTH ----------
@api_router.get("/")
async def root():
    return {"ok": True, "service": "executive-assistant"}

# ---------- GOOGLE OAUTH (Gmail + Calendar) ----------
import base64
import email.utils as eut
from email.message import EmailMessage as PyEmailMessage
import secrets as pysecrets

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me"
CALENDAR_API = "https://www.googleapis.com/calendar/v3"


async def _get_tokens_from_collection(collection, user_id: str, extra_filter: Optional[dict] = None) -> Optional[dict]:
    query = {"user_id": user_id}
    if extra_filter:
        query.update(extra_filter)
    doc = await collection.find_one(query, {"_id": 0})
    if not doc:
        return None
    expires_at = doc.get("expires_at")
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at and expires_at < datetime.now(timezone.utc) + timedelta(minutes=2):
        refreshed = await _refresh_token_in_collection(collection, query, doc.get("refresh_token", ""))
        if refreshed:
            doc.update(refreshed)
    return doc


async def _refresh_token_in_collection(collection, query: dict, refresh_token: str) -> Optional[dict]:
    async with httpx.AsyncClient() as hx:
        resp = await hx.post(GOOGLE_TOKEN_URL, data={
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        }, timeout=15.0)
    if resp.status_code != 200:
        return None
    payload = resp.json()
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=payload.get("expires_in", 3500))
    update = {"access_token": payload["access_token"], "expires_at": expires_at}
    await collection.update_one(query, {"$set": update})
    return update


async def get_email_tokens(user_id: str, account_label: Optional[str] = None) -> Optional[dict]:
    if account_label:
        return await _get_tokens_from_collection(db.google_tokens_email, user_id, {"account_label": account_label})
    # Return first available email token (any account)
    return await _get_tokens_from_collection(db.google_tokens_email, user_id)


async def get_all_email_tokens(user_id: str) -> List[dict]:
    """Return all connected email account tokens for this user."""
    cursor = db.google_tokens_email.find({"user_id": user_id}, {"_id": 0})
    docs = await cursor.to_list(10)
    result = []
    for doc in docs:
        expires_at = doc.get("expires_at")
        if expires_at and expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at and expires_at < datetime.now(timezone.utc) + timedelta(minutes=2):
            query = {"user_id": user_id, "account_label": doc.get("account_label", "caars")}
            refreshed = await _refresh_token_in_collection(db.google_tokens_email, query, doc.get("refresh_token", ""))
            if refreshed:
                doc.update(refreshed)
        result.append(doc)
    return result


async def get_calendar_tokens(user_id: str) -> Optional[dict]:
    return await _get_tokens_from_collection(db.google_tokens_calendar, user_id)


# Legacy alias — points to email tokens (Gmail is primary)
async def get_google_tokens(user_id: str) -> Optional[dict]:
    return await get_email_tokens(user_id)


async def refresh_google_token(user_id: str, refresh_token: str) -> Optional[dict]:
    return await _refresh_token_in_collection(db.google_tokens_email, {"user_id": user_id}, refresh_token)


@api_router.get("/google/login-url")
async def google_login_url():
    """Public endpoint — returns Google OAuth URL without requiring a token (used for initial login via caars.fi Gmail)."""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google not configured")
    import secrets as pysecrets2
    state = pysecrets2.token_urlsafe(24)
    await db.google_oauth_states.insert_one({
        "state": state,
        "user_id": None,
        "scope_type": "email",
        "created_at": datetime.now(timezone.utc),
    })
    from urllib.parse import urlencode
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": GOOGLE_SCOPES_EMAIL,
        "access_type": "offline",
        "prompt": "consent",
        "state": state,
    }
    auth_url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"
    return {"auth_url": auth_url}


@api_router.get("/google/connect")
async def google_connect(
    authorization: Optional[str] = Header(default=None),
    scope_type: str = "email",
    account_label: str = "caars",
):
    """Connect a Google account. scope_type: 'email' or 'calendar'. account_label: 'caars'|'brai'|'gmail'."""
    user = await get_user_from_token(authorization)
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google not configured")
    if scope_type not in ("email", "calendar"):
        scope_type = "email"
    scopes = GOOGLE_SCOPES_EMAIL if scope_type == "email" else GOOGLE_SCOPES_CALENDAR
    state = pysecrets.token_urlsafe(24)
    await db.google_oauth_states.insert_one({
        "state": state,
        "user_id": user.user_id,
        "scope_type": scope_type,
        "account_label": account_label,
        "created_at": datetime.now(timezone.utc),
    })
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": scopes,
        "access_type": "offline",
        "prompt": "consent",
        "state": state,
    }
    from urllib.parse import urlencode
    auth_url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"
    return {"auth_url": auth_url}


@api_router.get("/google/callback")
async def google_callback(code: Optional[str] = None, state: Optional[str] = None,
                          error: Optional[str] = None):
    from fastapi.responses import RedirectResponse
    import secrets as pysecrets3
    if error or not code or not state:
        return _html_close_page(False, f"Virhe: {error or 'puuttuva code/state'}")
    state_doc = await db.google_oauth_states.find_one({"state": state}, {"_id": 0})
    if not state_doc:
        return _html_close_page(False, "Tunnistamaton state-parametri")
    user_id = state_doc.get("user_id")
    scope_type = state_doc.get("scope_type", "email")  # "email" or "calendar"
    account_label = state_doc.get("account_label", "caars")
    await db.google_oauth_states.delete_one({"state": state})

    async with httpx.AsyncClient() as hx:
        resp = await hx.post(GOOGLE_TOKEN_URL, data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        }, timeout=15.0)
    if resp.status_code != 200:
        return _html_close_page(False, f"Token-vaihto epäonnistui: {resp.text[:200]}")
    payload = resp.json()
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=payload.get("expires_in", 3500))

    # Get user info from Google
    google_info = {}
    if payload.get("access_token"):
        async with httpx.AsyncClient() as hx:
            r2 = await hx.get(
                "https://openidconnect.googleapis.com/v1/userinfo",
                headers={"Authorization": f"Bearer {payload['access_token']}"},
                timeout=15.0,
            )
            if r2.status_code == 200:
                google_info = r2.json()

    google_email = google_info.get("email")

    # If no user_id (initial login), create or find user by email
    if not user_id:
        if not google_email:
            return _html_close_page(False, "Sähköpostia ei saatu Googlelta")
        existing = await db.users.find_one({"email": google_email}, {"_id": 0})
        if existing:
            user_id = existing["user_id"]
        else:
            user_id = str(uuid.uuid4())
            new_user = {
                "user_id": user_id,
                "email": google_email,
                "name": google_info.get("name", google_email),
                "picture": google_info.get("picture"),
                "created_at": datetime.now(timezone.utc),
            }
            await db.users.insert_one(new_user)

    if scope_type == "calendar":
        token_collection = db.google_tokens_calendar
        upsert_key = {"user_id": user_id}
    else:
        token_collection = db.google_tokens_email
        upsert_key = {"user_id": user_id, "account_label": account_label}
    await token_collection.update_one(
        upsert_key,
        {"$set": {
            "user_id": user_id,
            "account_label": account_label if scope_type == "email" else None,
            "google_email": google_email,
            "scope_type": scope_type,
            "access_token": payload["access_token"],
            "refresh_token": payload.get("refresh_token"),
            "expires_at": expires_at,
            "scope": payload.get("scope"),
            "connected_at": datetime.now(timezone.utc),
        }},
        upsert=True,
    )

    # Create session token and redirect to frontend
    session_token = pysecrets3.token_urlsafe(32)
    await db.user_sessions.update_one(
        {"user_id": user_id},
        {"$set": {
            "session_token": session_token,
            "user_id": user_id,
            "created_at": datetime.now(timezone.utc),
            "expires_at": datetime.now(timezone.utc) + timedelta(days=30),
        }},
        upsert=True,
    )
    frontend_url = os.environ.get('FRONTEND_CALLBACK_URL', 'frontend://auth') + f"?token={session_token}"
    return RedirectResponse(url=frontend_url)


def _html_close_page(success: bool, msg: str):
    from fastapi.responses import HTMLResponse
    color = "#82C98C" if success else "#E07A7C"
    icon = "✓" if success else "✕"
    html = f"""<!doctype html><html><head><meta charset="utf-8"><title>Google</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
      body {{ background:#0F1115; color:#F2F4F7; font-family:-apple-system,system-ui,sans-serif;
             display:flex; align-items:center; justify-content:center; height:100vh; margin:0; padding:24px; text-align:center; }}
      .card {{ max-width: 400px; }}
      .icon {{ width:80px; height:80px; border-radius:40px; background:{color}33; color:{color};
              display:flex; align-items:center; justify-content:center; font-size:40px; margin:0 auto 24px; }}
      h1 {{ font-size:24px; margin:0 0 12px; }}
      p {{ color:#98A2B3; margin:0; }}
      .hint {{ margin-top: 24px; font-size: 13px; color: #667085; }}
    </style></head>
    <body><div class="card">
      <div class="icon">{icon}</div>
      <h1>{msg}</h1>
      <p>Voit sulkea tämän välilehden ja palata sovellukseen.</p>
      <p class="hint">Sovellus synkronoi sähköpostit ja kalenterin automaattisesti.</p>
    </div>
    <script>setTimeout(()=>{{window.close()}}, 2000);</script>
    </body></html>"""
    return HTMLResponse(content=html)


@api_router.get("/google/status")
async def google_status(authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    email_docs = await db.google_tokens_email.find(
        {"user_id": user.user_id}, {"_id": 0, "access_token": 0, "refresh_token": 0}
    ).to_list(10)
    cal_doc = await db.google_tokens_calendar.find_one({"user_id": user.user_id}, {"_id": 0, "access_token": 0, "refresh_token": 0})
    email_accounts = [
        {
            "label": d.get("account_label", "caars"),
            "google_email": d.get("google_email"),
            "connected_at": d.get("connected_at"),
        }
        for d in email_docs
    ]
    # Backward-compat fields based on first email doc
    first_email = email_docs[0] if email_docs else None
    return {
        "connected": bool(email_docs),
        "email_connected": bool(email_docs),
        "email_account": first_email.get("google_email") if first_email else None,
        "email_connected_at": first_email.get("connected_at") if first_email else None,
        "email_accounts": email_accounts,
        "calendar_connected": bool(cal_doc),
        "calendar_account": cal_doc.get("google_email") if cal_doc else None,
        "calendar_connected_at": cal_doc.get("connected_at") if cal_doc else None,
        "last_sync_at": first_email.get("last_sync_at") if first_email else None,
    }


@api_router.get("/calendar/events")
async def calendar_events(
    authorization: Optional[str] = Header(default=None),
    days_back: int = 30,
    days_forward: int = 60,
):
    user = await get_user_from_token(authorization)
    tokens = await get_calendar_tokens(user.user_id) or await get_email_tokens(user.user_id)
    if not tokens:
        raise HTTPException(status_code=400, detail="Google ei yhdistetty")
    headers_auth = {"Authorization": f"Bearer {tokens['access_token']}"}
    time_min = (datetime.now(timezone.utc) - timedelta(days=days_back)).isoformat().replace("+00:00", "Z")
    time_max = (datetime.now(timezone.utc) + timedelta(days=days_forward)).isoformat().replace("+00:00", "Z")
    async with httpx.AsyncClient() as hx:
        resp = await hx.get(
            f"{CALENDAR_API}/calendars/primary/events",
            params={
                "timeMin": time_min,
                "timeMax": time_max,
                "singleEvents": "true",
                "orderBy": "startTime",
                "maxResults": 200,
            },
            headers=headers_auth,
            timeout=15.0,
        )
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text[:200])
    items = resp.json().get("items", [])
    events = []
    for ev in items:
        start = ev.get("start", {})
        end = ev.get("end", {})
        events.append({
            "id": ev.get("id"),
            "title": ev.get("summary", "(nimetön)"),
            "start": start.get("dateTime") or start.get("date"),
            "end": end.get("dateTime") or end.get("date"),
            "location": ev.get("location"),
            "description": ev.get("description"),
            "html_link": ev.get("htmlLink"),
            "all_day": "dateTime" not in start,
        })
    return {"events": events}


class CalendarEventUpdate(BaseModel):
    shift_days: Optional[int] = None      # +1 huominen, +2 ylihuominen
    shift_hours: Optional[int] = None     # siirrä n tuntia eteenpäin
    color: Optional[str] = None           # colorId: "1"=sininen, "2"=vihreä, "3"=violetti, "4"=punainen, "5"=keltainen, "6"=oranssi, "11"=tomaatti

@api_router.patch("/calendar/events/{event_id}")
async def update_calendar_event(
    event_id: str,
    body: CalendarEventUpdate,
    authorization: Optional[str] = Header(default=None),
):
    user = await get_user_from_token(authorization)
    tokens = await get_calendar_tokens(user.user_id) or await get_email_tokens(user.user_id)
    if not tokens:
        raise HTTPException(status_code=400, detail="Google ei yhdistetty")
    headers_auth = {"Authorization": f"Bearer {tokens['access_token']}"}
    async with httpx.AsyncClient() as hx:
        r = await hx.get(f"{CALENDAR_API}/calendars/primary/events/{event_id}", headers=headers_auth, timeout=10.0)
    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail="Tapahtumaa ei löydy")
    ev = r.json()
    patch: dict = {}
    if body.shift_days is not None or body.shift_hours is not None:
        start = ev.get("start", {})
        end = ev.get("end", {})
        all_day = "date" in start and "dateTime" not in start
        if all_day:
            from datetime import date
            s = date.fromisoformat(start["date"])
            e = date.fromisoformat(end["date"])
            delta = timedelta(days=body.shift_days or 0)
            patch["start"] = {"date": (s + delta).isoformat()}
            patch["end"] = {"date": (e + delta).isoformat()}
        else:
            s = datetime.fromisoformat(start["dateTime"].replace("Z", "+00:00"))
            e = datetime.fromisoformat(end["dateTime"].replace("Z", "+00:00"))
            delta = timedelta(days=body.shift_days or 0, hours=body.shift_hours or 0)
            patch["start"] = {"dateTime": (s + delta).isoformat(), "timeZone": start.get("timeZone", "Europe/Helsinki")}
            patch["end"] = {"dateTime": (e + delta).isoformat(), "timeZone": end.get("timeZone", "Europe/Helsinki")}
    if body.color is not None:
        patch["colorId"] = body.color
    async with httpx.AsyncClient() as hx:
        r2 = await hx.patch(
            f"{CALENDAR_API}/calendars/primary/events/{event_id}",
            json=patch,
            headers={**headers_auth, "Content-Type": "application/json"},
            timeout=10.0,
        )
    if r2.status_code not in (200, 204):
        raise HTTPException(status_code=r2.status_code, detail=r2.text[:200])
    return {"ok": True}

@api_router.delete("/calendar/events/{event_id}")
async def delete_calendar_event(
    event_id: str,
    authorization: Optional[str] = Header(default=None),
):
    user = await get_user_from_token(authorization)
    tokens = await get_calendar_tokens(user.user_id) or await get_email_tokens(user.user_id)
    if not tokens:
        raise HTTPException(status_code=400, detail="Google ei yhdistetty")
    headers_auth = {"Authorization": f"Bearer {tokens['access_token']}"}
    async with httpx.AsyncClient() as hx:
        r = await hx.delete(f"{CALENDAR_API}/calendars/primary/events/{event_id}", headers=headers_auth, timeout=10.0)
    if r.status_code not in (200, 204):
        raise HTTPException(status_code=r.status_code, detail=r.text[:200])
    return {"ok": True}


@api_router.get("/gmail/messages")
async def gmail_messages(
    authorization: Optional[str] = Header(default=None),
    max_results: int = 50,
    q: str = "",
):
    user = await get_user_from_token(authorization)
    tokens = await get_google_tokens(user.user_id)
    if not tokens:
        raise HTTPException(status_code=400, detail="Google ei yhdistetty")
    headers_auth = {"Authorization": f"Bearer {tokens['access_token']}"}
    params: dict = {"maxResults": max_results, "labelIds": "INBOX"}
    if q:
        params["q"] = q
    async with httpx.AsyncClient() as hx:
        list_resp = await hx.get(
            f"{GMAIL_API}/messages",
            params=params,
            headers=headers_auth,
            timeout=15.0,
        )
    if list_resp.status_code != 200:
        raise HTTPException(status_code=list_resp.status_code, detail=list_resp.text[:200])
    message_ids = [m["id"] for m in list_resp.json().get("messages", [])]
    messages = []
    async with httpx.AsyncClient() as hx:
        for mid in message_ids[:30]:
            r = await hx.get(
                f"{GMAIL_API}/messages/{mid}",
                params={"format": "metadata", "metadataHeaders": ["From", "Subject", "Date"]},
                headers=headers_auth,
                timeout=10.0,
            )
            if r.status_code != 200:
                continue
            data = r.json()
            headers_map = {h["name"]: h["value"] for h in data.get("payload", {}).get("headers", [])}
            messages.append({
                "id": mid,
                "thread_id": data.get("threadId"),
                "from": headers_map.get("From", ""),
                "subject": headers_map.get("Subject", "(ei aihetta)"),
                "date": headers_map.get("Date", ""),
                "snippet": data.get("snippet", ""),
                "unread": "UNREAD" in data.get("labelIds", []),
            })
    return {"messages": messages}


@api_router.post("/google/disconnect")
async def google_disconnect(
    authorization: Optional[str] = Header(default=None),
    scope_type: str = "all",
    account_label: Optional[str] = None,
):
    user = await get_user_from_token(authorization)
    if scope_type == "calendar":
        await db.google_tokens_calendar.delete_one({"user_id": user.user_id})
    elif scope_type == "email":
        query: dict = {"user_id": user.user_id}
        if account_label:
            query["account_label"] = account_label
        await db.google_tokens_email.delete_one(query)
    else:
        await db.google_tokens_email.delete_many({"user_id": user.user_id})
        await db.google_tokens_calendar.delete_one({"user_id": user.user_id})
    return {"ok": True}


def _b64url_decode(s: str) -> bytes:
    s = s.replace("-", "+").replace("_", "/")
    s += "=" * (-len(s) % 4)
    return base64.b64decode(s)


def _extract_body(payload: dict) -> str:
    """Recursively extract text/plain body from Gmail message payload."""
    if not payload:
        return ""
    mime = payload.get("mimeType", "")
    body = payload.get("body", {})
    if mime == "text/plain" and body.get("data"):
        try:
            return _b64url_decode(body["data"]).decode("utf-8", errors="ignore")
        except Exception:
            return ""
    if mime.startswith("multipart/"):
        for part in payload.get("parts", []):
            # prefer text/plain
            if part.get("mimeType") == "text/plain":
                text = _extract_body(part)
                if text:
                    return text
        # fallback: recurse all
        for part in payload.get("parts", []):
            text = _extract_body(part)
            if text:
                return text
    if mime == "text/html" and body.get("data"):
        # crude HTML strip
        import re
        html = _b64url_decode(body["data"]).decode("utf-8", errors="ignore")
        return re.sub(r"<[^>]+>", "", html).strip()
    return ""


def _header(headers: list, name: str) -> str:
    for h in headers:
        if h.get("name", "").lower() == name.lower():
            return h.get("value", "")
    return ""


@api_router.post("/google/sync")
async def google_sync(authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    all_email_tokens = await get_all_email_tokens(user.user_id)
    cal_tokens = await get_calendar_tokens(user.user_id)
    if not all_email_tokens and not cal_tokens:
        raise HTTPException(status_code=400, detail="Google ei kytketty")

    summary = {"emails_added": 0, "emails_skipped": 0, "events_added": 0, "events_updated": 0}

    async with httpx.AsyncClient(timeout=30.0) as hx:
        # ----- GMAIL (kaikki yhdistetyt sähköpostitilit) -----
        for email_tokens in all_email_tokens:
            headers_email = {"Authorization": f"Bearer {email_tokens['access_token']}"}
            list_resp = await hx.get(
                f"{GMAIL_API}/threads",
                params={"q": "in:inbox newer_than:30d -from:me", "maxResults": 50},
                headers=headers_email,
            )
            if list_resp.status_code != 200:
                raise HTTPException(status_code=500, detail=f"Gmail list failed: {list_resp.text[:200]}")
            threads = list_resp.json().get("threads", [])

            for th in threads:
                tid = th["id"]
                th_resp = await hx.get(
                    f"{GMAIL_API}/threads/{tid}",
                    params={"format": "metadata", "metadataHeaders": ["From", "Subject", "Date"]},
                    headers=headers_email,
                )
                if th_resp.status_code != 200:
                    continue
                th_data = th_resp.json()
                messages = th_data.get("messages", [])
                is_first_email = len(messages) == 1
                # Use the latest message in thread
                msg_id = messages[-1]["id"]
                existing = await db.emails.find_one(
                    {"user_id": user.user_id, "gmail_message_id": msg_id}, {"_id": 0}
                )
                if existing:
                    summary["emails_skipped"] += 1
                    continue
                m_resp = await hx.get(f"{GMAIL_API}/messages/{msg_id}", headers=headers_email)
                if m_resp.status_code != 200:
                    continue
                m = m_resp.json()
                payload_data = m.get("payload", {})
                msg_headers = payload_data.get("headers", [])
                from_raw = _header(msg_headers, "From")
                subject = _header(msg_headers, "Subject") or "(ei aihetta)"
                date_str = _header(msg_headers, "Date")
                sender_name, sender_email_addr = eut.parseaddr(from_raw)
                if not sender_email_addr:
                    continue
                le = sender_email_addr.lower()
                if any(x in le for x in ["noreply", "no-reply", "donotreply", "mailer-daemon", "notifications@", "newsletter"]):
                    summary["emails_skipped"] += 1
                    continue
                body = _extract_body(payload_data) or m.get("snippet", "")
                try:
                    received_at = eut.parsedate_to_datetime(date_str)
                    if received_at.tzinfo is None:
                        received_at = received_at.replace(tzinfo=timezone.utc)
                except Exception:
                    received_at = datetime.now(timezone.utc)
                source = "caars_web_form" if "caars" in (subject + body).lower() else "gmail"
                new_email = EmailMessage(
                    user_id=user.user_id,
                    sender_name=sender_name or sender_email_addr,
                    sender_email=sender_email_addr,
                    subject=subject,
                    body=body[:8000],
                    received_at=received_at,
                    category="customer_lead",
                    status="needs_review",
                    is_first_email=True,
                    source=source,
                )
                doc = new_email.dict()
                doc["gmail_message_id"] = msg_id
                doc["gmail_thread_id"] = tid
                await db.emails.insert_one(doc)
                summary["emails_added"] += 1
                # AUTO-REPLY DISABLED — manually re-enable when ready

        # ----- CALENDAR (hans@brai.fi) -----
        cal_tokens_used = cal_tokens or (all_email_tokens[0] if all_email_tokens else None)
        if cal_tokens_used:
            headers_cal = {"Authorization": f"Bearer {cal_tokens_used['access_token']}"}
            now_iso = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
            end_iso = (datetime.now(timezone.utc) + timedelta(days=14)).isoformat().replace("+00:00", "Z")
            cal_resp = await hx.get(
                f"{CALENDAR_API}/calendars/primary/events",
                params={"timeMin": now_iso, "timeMax": end_iso, "singleEvents": "true", "orderBy": "startTime", "maxResults": 50},
                headers=headers_cal,
            )
            if cal_resp.status_code == 200:
                for ev in cal_resp.json().get("items", []):
                    ev_id = ev.get("id")
                    if not ev_id:
                        continue
                    start = ev.get("start", {}).get("dateTime") or ev.get("start", {}).get("date")
                    if not start:
                        continue
                    try:
                        due_at = datetime.fromisoformat(start.replace("Z", "+00:00"))
                        if due_at.tzinfo is None:
                            due_at = due_at.replace(tzinfo=timezone.utc)
                    except Exception:
                        continue
                    title = ev.get("summary", "(nimetön tapahtuma)")
                    location = ev.get("location")
                    description = ev.get("description")
                    existing = await db.tasks.find_one(
                        {"user_id": user.user_id, "google_event_id": ev_id}, {"_id": 0}
                    )
                    if existing:
                        await db.tasks.update_one(
                            {"task_id": existing["task_id"]},
                            {"$set": {"title": title, "due_at": due_at, "location": location, "description": description}},
                        )
                        summary["events_updated"] += 1
                    else:
                        new_task = Task(
                            user_id=user.user_id, title=title, description=description,
                            due_at=due_at, source="calendar", location=location,
                        )
                        doc = new_task.dict()
                        doc["google_event_id"] = ev_id
                        await db.tasks.insert_one(doc)
                        summary["events_added"] += 1

    if email_tokens:
        await db.google_tokens_email.update_one(
            {"user_id": user.user_id},
            {"$set": {"last_sync_at": datetime.now(timezone.utc)}},
        )
    return summary


async def send_via_gmail(user_id: str, to_email: str, subject: str, body: str,
                         in_reply_to_message_id: Optional[str] = None,
                         thread_id: Optional[str] = None,
                         token_override: Optional[dict] = None) -> bool:
    tokens = token_override or await get_google_tokens(user_id)
    if not tokens:
        return False
    msg = PyEmailMessage()
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body)
    if in_reply_to_message_id:
        msg["In-Reply-To"] = in_reply_to_message_id
        msg["References"] = in_reply_to_message_id
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode("utf-8")
    payload = {"raw": raw}
    if thread_id:
        payload["threadId"] = thread_id
    async with httpx.AsyncClient(timeout=30.0) as hx:
        resp = await hx.post(
            f"{GMAIL_API}/messages/send",
            headers={"Authorization": f"Bearer {tokens['access_token']}", "Content-Type": "application/json"},
            json=payload,
        )
    return resp.status_code in (200, 202)


# ========== INVOICES ==========

class InvoiceCreate(BaseModel):
    client_name: str
    client_email: Optional[str] = None
    items: List[InvoiceItem] = []
    status: Literal["draft", "sent", "paid"] = "draft"
    due_date: Optional[datetime] = None
    notes: Optional[str] = None

class InvoiceUpdate(BaseModel):
    client_name: Optional[str] = None
    client_email: Optional[str] = None
    items: Optional[List[InvoiceItem]] = None
    status: Optional[Literal["draft", "sent", "paid"]] = None
    due_date: Optional[datetime] = None
    notes: Optional[str] = None

@api_router.get("/invoices")
async def list_invoices(authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    cursor = db.invoices.find({"user_id": user.user_id}, {"_id": 0}).sort("created_at", -1)
    items = await cursor.to_list(200)
    return {"items": items}

@api_router.post("/invoices")
async def create_invoice(body: InvoiceCreate, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    inv = Invoice(user_id=user.user_id, **body.dict())
    await db.invoices.insert_one(inv.dict())
    return inv.dict()

@api_router.patch("/invoices/{invoice_id}")
async def update_invoice(invoice_id: str, body: InvoiceUpdate, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    update = {k: v for k, v in body.dict().items() if v is not None}
    update["updated_at"] = datetime.now(timezone.utc)
    if "items" in update:
        update["items"] = [i.dict() if hasattr(i, "dict") else i for i in update["items"]]
    result = await db.invoices.update_one(
        {"invoice_id": invoice_id, "user_id": user.user_id},
        {"$set": update},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Laskua ei löydy")
    return {"ok": True}

@api_router.delete("/invoices/{invoice_id}")
async def delete_invoice(invoice_id: str, authorization: Optional[str] = Header(default=None)):
    user = await get_user_from_token(authorization)
    await db.invoices.delete_one({"invoice_id": invoice_id, "user_id": user.user_id})
    return {"ok": True}


# ========== WEBHOOK (nettilomake / chatbot) ==========

class WebhookMessage(BaseModel):
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    source: str = "caars_web_form"   # caars_web_form | chatbot
    api_key: str                      # simple shared secret

WEBHOOK_API_KEY = os.environ.get("WEBHOOK_API_KEY", "caars-webhook-2026")

@api_router.post("/webhook/message")
async def webhook_message(body: WebhookMessage):
    if body.api_key != WEBHOOK_API_KEY:
        raise HTTPException(status_code=401, detail="Virheellinen API-avain")
    # Find the owner user (first user in DB — single-user app)
    owner = await db.users.find_one({}, {"_id": 0})
    if not owner:
        raise HTTPException(status_code=404, detail="Käyttäjää ei löydy")
    email_doc = EmailMessage(
        user_id=owner["user_id"],
        sender_name=body.name,
        sender_email=body.email,
        subject=body.subject or f"Uusi viesti: {body.name}",
        body=body.message,
        received_at=datetime.now(timezone.utc),
        category="customer_lead",
        status="needs_review",
        is_first_email=True,
        source=body.source,
    )
    await db.emails.insert_one(email_doc.dict())
    return {"ok": True, "email_id": email_doc.email_id}


# Mount router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup():
    try:
        await db.users.create_index("email", unique=True)
        await db.users.create_index("user_id", unique=True)
        await db.user_sessions.create_index("session_token", unique=True)
        await db.user_sessions.create_index("expires_at", expireAfterSeconds=0)
        await db.emails.create_index([("user_id", 1), ("received_at", -1)])
        await db.tasks.create_index([("user_id", 1), ("due_at", 1)])
    except Exception as e:
        print(f"Warning: MongoDB index creation failed: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
