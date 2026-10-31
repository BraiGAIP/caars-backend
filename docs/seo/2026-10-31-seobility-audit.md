# CAARS TEKNINEN SEO GEO AEO — Seobility 31.10.2026

Lähde: Seobility MCP, projekti 1022388, valmis crawl #31 / 16196143. Valmistui 31.10.2026 klo 09.43 Suomen aikaa. Kokonaispisteet 95/100, tekniikka 95, rakenne 95, sisältö 94. Kuva vastaa tätä tarkistusta.

Tila: sivukohtainen selvitys valmis; verkkosivuston korjauksia tai julkaisua ei tässä vaiheessa tehty. Kaikki alla olevat tehtävät ovat avoinna.

## Korjausjärjestys

- [ ] P1: Korjaa vertailuartikkelin kaksi 404-lähdelinkkiä (Vero ja Traficom); varmista aiheeseen sopivat korvaavat viralliset sivut ennen vaihtoa.
- [ ] P1: Selvitä /market/ehdot → etusivu. Marketin ehtolinkin pitää johtaa oikeisiin ehtoihin. Älä vaihda kohdetta arvaamalla.
- [ ] P2: Vaihda /tilastokeskus-sivun /volvo-tuonti-ruotsista-linkki suoraan lopulliseen kohteeseen /tuonti/volvo-xc60-tuonti-ruotsista.
- [ ] P2: Erota etusivun “lue lisää ja tilaa” -linkit palvelukohtaisiksi (Etsintäpalvelu / Maksupalvelu).
- [ ] P2: Selvitä Market-korttien lataustekstin päätyminen linkkitekstiksi; käytä auton nimeä ja mallia kuvaavia linkkitekstejä.
- [ ] P2: Erota Audi e-tron, e-tron GT ja Q8 e-tron -sivujen hakutarkoitus. Seobilityn yksi havainto on yksi kolmen URL:n ryhmä; tämä ei yksin todista ranking-kannibalisaatiota.
- [ ] P2: Lisää /tuontiauton-rahoitus-sivulle tarkoituksenmukaiset sisäiset linkit. Raportin linkkimäärä 2; tarkista linkkien suunta sivuanalyysistä ennen toteutusta.
- [ ] P2: Korjaa otsikoiden ja leipätekstin vastaavuus luontevasti. Älä lisää täytesanoja vain pisteiden takia.
- [ ] P2: Poista tai muotoile saman sivun toistot: etusivun matkakulukappale, TuontiAvun palvelurajaus, BMW-artikkelin hintavertailu.
- [ ] P3: Arvioi vähätekstiset sivut käyttötarkoituksen mukaan. Yhteystiedot ja ehdot eivät tarvitse automaattisesti 500 sanaa.
- [ ] P3: Tutki 70 sivun palvelinvasteet ja välimuisti erikseen. Seobilityn vasteaika ei ole koko sivun latausaika eikä Core Web Vitals -mittaus.
- [ ] P3: Tarkista mobile.de- ja Tulli-linkkien 403 selaimella; ne eivät yksin osoita rikkinäistä sivua. Säilytä toimivat wa.me-linkit: viisi huomautusta liittyy normaaliin hostin vaihtumiseen api.whatsapp.comiin.
- [ ] Varmennus: julkaistujen korjausten jälkeen uusi Seobility-crawl ja vertailu samaan lähtötasoon.

## Saman sivun toistuvat kappaleet

### https://caars.fi/

- Matkakulut halvimman toteuttamiskelpoisen vaihtoehdon mukaan; sovitaan ennen tilausta. 890 € ei ole kokonaishinta.... (esiintymiä 2)

### https://caars.fi/tuontiapu

- TuontiApu ei sisällä myyjän kontaktointia tai hintaneuvottelua ulkomailla, vaan keskittyy tuontiprosessin läpivientiin. Autonhakuun ja -neuvotteluun ovat Etsintäpalvelu ja Perusselvitys.... (esiintymiä 2)

### https://caars.fi/blogi/bmw-tuonti-saksasta

- Saksa: 28 000 € → Suomessa: 34 000–37 000 € → Tyypillisesti halvempi, vähemmän ajettu ja paremmin varusteltu... (esiintymiä 2)

## Kuvan kaikkien havaintojen tarkat URL:t ja tiedot

### pages-with-medium-server-response-times

```json
{
  "data": {
    "rows": [
      {
        "page": "https://caars.fi/uutiset/auton-tuonti-hinta-mita-tuontiauton-kustannukset-sisaltavat",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5027
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 93
          }
        ],
        "problems": [],
        "strikehash": 1673348016,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/volkswagen-tiguan-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5115
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 95
          }
        ],
        "problems": [],
        "strikehash": 41140967,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/porsche-macan-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5121
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 95
          }
        ],
        "problems": [],
        "strikehash": 965610619,
        "checked": false
      },
      {
        "page": "https://caars.fi/uutiset/auton-tuonti-hinta-mita-tuontiauto-oikeasti-maksaa",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.514
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 95
          }
        ],
        "problems": [],
        "strikehash": 536839511,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/tesla-model-3-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5314
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 98
          }
        ],
        "problems": [],
        "strikehash": 677956678,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/porsche-taycan-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5512
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 102
          }
        ],
        "problems": [],
        "strikehash": 3756447310,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/volvo-c40-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5578
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 103
          }
        ],
        "problems": [],
        "strikehash": 3060634861,
        "checked": false
      },
      {
        "page": "https://caars.fi/tilaa-perusselvitys",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5591
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 104
          }
        ],
        "problems": [],
        "strikehash": 2055731790,
        "checked": false
      },
      {
        "page": "https://caars.fi/autoverolaskuri",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5687
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 105
          }
        ],
        "problems": [],
        "strikehash": 163026328,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/bmw-x1-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5812
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 108
          }
        ],
        "problems": [],
        "strikehash": 2378097742,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/volvo-xc90-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5831
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 108
          }
        ],
        "problems": [],
        "strikehash": 3414259366,
        "checked": false
      },
      {
        "page": "https://caars.fi/market",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5845
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 108
          }
        ],
        "problems": [],
        "strikehash": 2430357726,
        "checked": false
      },
      {
        "page": "https://caars.fi/auton-etsinta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5881
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 109
          }
        ],
        "problems": [],
        "strikehash": 2773723657,
        "checked": false
      },
      {
        "page": "https://caars.fi/kustannuslaskuri",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5951
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 110
          }
        ],
        "problems": [],
        "strikehash": 1134655902,
        "checked": false
      },
      {
        "page": "https://caars.fi/auton-tuontipalvelu",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5968
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 111
          }
        ],
        "problems": [],
        "strikehash": 2007587985,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/auton-tuonti-ruotsista-opas-2024",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5971
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 111
          }
        ],
        "problems": [],
        "strikehash": 799204378,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/mercedes-c-sarjan-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.5989
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 111
          }
        ],
        "problems": [],
        "strikehash": 702639215,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/audi-a6-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.6064
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 112
          }
        ],
        "problems": [],
        "strikehash": 3459434573,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/mista-etsia-auto-ulkomailta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.6089
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 113
          }
        ],
        "problems": [],
        "strikehash": 1224349084,
        "checked": false
      },
      {
        "page": "https://caars.fi/auton-tuonti-verotus",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.6384
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 118
          }
        ],
        "problems": [],
        "strikehash": 1596744822,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/volvo-v90-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.6456
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 120
          }
        ],
        "problems": [],
        "strikehash": 1242202088,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/mercedes-e-sarjan-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.6511
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 121
          }
        ],
        "problems": [],
        "strikehash": 2581347903,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/kannattaako-tuoda-auto-ulkomailta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.6522
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 121
          }
        ],
        "problems": [],
        "strikehash": 2440545415,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/volvo-xc60-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.6523
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 121
          }
        ],
        "problems": [],
        "strikehash": 2283724904,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/audi-q3-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.6535
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 121
          }
        ],
        "problems": [],
        "strikehash": 339704025,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/mercedes-glc-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.6665
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 123
          }
        ],
        "problems": [],
        "strikehash": 481432492,
        "checked": false
      },
      {
        "page": "https://caars.fi/kayttoehdot",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.6689
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 124
          }
        ],
        "problems": [],
        "strikehash": 4234734482,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/skoda-octavia-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.6704
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 124
          }
        ],
        "problems": [],
        "strikehash": 3295077779,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/tesla-model-y-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.6758
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 125
          }
        ],
        "problems": [],
        "strikehash": 3049520905,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/audi-a4-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.6814
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 126
          }
        ],
        "problems": [],
        "strikehash": 437147786,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/tuontiauton-osto-rahoituksella",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.6825
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 126
          }
        ],
        "problems": [],
        "strikehash": 2650860986,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/volkswagen-id3-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7039
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 130
          }
        ],
        "problems": [],
        "strikehash": 3770463923,
        "checked": false
      },
      {
        "page": "https://caars.fi/hinnasto",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7069
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 131
          }
        ],
        "problems": [],
        "strikehash": 4001462076,
        "checked": false
      },
      {
        "page": "https://caars.fi/palvelumme",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7222
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 134
          }
        ],
        "problems": [],
        "strikehash": 1248634557,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/mercedes-eqc-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7232
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 134
          }
        ],
        "problems": [],
        "strikehash": 3339962063,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/bmw-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7285
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 135
          }
        ],
        "problems": [],
        "strikehash": 2320091363,
        "checked": false
      },
      {
        "page": "https://caars.fi/konsultointi",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7307
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 135
          }
        ],
        "problems": [],
        "strikehash": 2142557547,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/seat-cupra-formentor-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7451
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 138
          }
        ],
        "problems": [],
        "strikehash": 1608447857,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/mercedes-c-300e-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7458
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 138
          }
        ],
        "problems": [],
        "strikehash": 1168360805,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/bmw-x5-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7667
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 142
          }
        ],
        "problems": [],
        "strikehash": 4273390465,
        "checked": false
      },
      {
        "page": "https://caars.fi/uutiset",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7717
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 143
          }
        ],
        "problems": [],
        "strikehash": 1188834038,
        "checked": false
      },
      {
        "page": "https://caars.fi/uutiset/sahkoauton-tuonti-kattava-opas-jarkevaan-autokauppaan",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.782
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 145
          }
        ],
        "problems": [],
        "strikehash": 4083598487,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/volvo-v60-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7828
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 145
          }
        ],
        "problems": [],
        "strikehash": 160819494,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/audi-q5-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7836
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 145
          }
        ],
        "problems": [],
        "strikehash": 141486975,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/auto-ruotsista-vai-saksasta-vertailu",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7953
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 147
          }
        ],
        "problems": [],
        "strikehash": 2228281689,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/cupra-born-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7957
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 147
          }
        ],
        "problems": [],
        "strikehash": 1220915076,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.7962
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 147
          }
        ],
        "problems": [],
        "strikehash": 3036819631,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/autotuonti-rahoituksella",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.798
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 148
          }
        ],
        "problems": [],
        "strikehash": 464339141,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/bmw-320d-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.8005
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 148
          }
        ],
        "problems": [],
        "strikehash": 891244044,
        "checked": false
      },
      {
        "page": "https://caars.fi/uutiset/autovero-ja-tuontiauto-kaikki-mita-sinun-tulee-tietaa-verotuksesta-msiliduu",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.8095
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 150
          }
        ],
        "problems": [],
        "strikehash": 4044044389,
        "checked": false
      },
      {
        "page": "https://caars.fi/auton-tuonti-ulkomailta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.8114
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 150
          }
        ],
        "problems": [],
        "strikehash": 102900261,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/bmw-330e-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.8344
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 155
          }
        ],
        "problems": [],
        "strikehash": 2059394096,
        "checked": false
      },
      {
        "page": "https://caars.fi/tietosuoja",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.8465
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 157
          }
        ],
        "problems": [],
        "strikehash": 2014055256,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/polestar-2-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.8789
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 163
          }
        ],
        "problems": [],
        "strikehash": 149476783,
        "checked": false
      },
      {
        "page": "https://caars.fi/tilastokeskus",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.88
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 163
          }
        ],
        "problems": [],
        "strikehash": 1928265584,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/kia-ev6-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.8876
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 164
          }
        ],
        "problems": [],
        "strikehash": 2814763312,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/toyota-corolla-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.8945
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 166
          }
        ],
        "problems": [],
        "strikehash": 817849269,
        "checked": false
      },
      {
        "page": "https://caars.fi/kannattaako-tuoda-auto",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.9072
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 168
          }
        ],
        "problems": [],
        "strikehash": 2848994202,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/toyota-rav4-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.9077
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 168
          }
        ],
        "problems": [],
        "strikehash": 4280610082,
        "checked": false
      },
      {
        "page": "https://caars.fi/auton-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.9178
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 170
          }
        ],
        "problems": [],
        "strikehash": 1088620625,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/bmw-530e-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.9445
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 175
          }
        ],
        "problems": [],
        "strikehash": 2357385718,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/auton-tuonti-saksasta-2026",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.9505
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 176
          }
        ],
        "problems": [],
        "strikehash": 1484415825,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuontiapu",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.9524
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 176
          }
        ],
        "problems": [],
        "strikehash": 1516816759,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/autovero-tuontiautolle",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.9539
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 177
          }
        ],
        "problems": [],
        "strikehash": 3583062868,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuontiauton-rahoitus",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.9542
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 177
          }
        ],
        "problems": [],
        "strikehash": 1354545879,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/mercedes-glb-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.9609
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 178
          }
        ],
        "problems": [],
        "strikehash": 3909720206,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/volvo-xc60-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.9652
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 179
          }
        ],
        "problems": [],
        "strikehash": 2791772996,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuonti/audi-e-tron-tuonti-ruotsista",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.9689
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 179
          }
        ],
        "problems": [],
        "strikehash": 65373542,
        "checked": false
      },
      {
        "page": "https://caars.fi/autoliikkeille",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.98
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 181
          }
        ],
        "problems": [],
        "strikehash": 3341300673,
        "checked": false
      },
      {
        "page": "https://caars.fi/perusselvitys",
        "items": [
          {
            "type": "number",
            "key": "response_time",
            "response_time": 0.9843
          },
          {
            "type": "number",
            "key": "percentage_difference_to_avgerage_response_time",
            "percentage_difference_to_avgerage_response_time": 182
          }
        ],
        "problems": [],
        "strikehash": 1963163967,
        "checked": false
      }
    ],
    "filters": []
  },
  "pagination": {
    "total": 70,
    "offset": 0,
    "limit": 100
  },
  "crawl_id": 16196143
}
```

### link-anchor-text-duplicates-for-different-pages

```json
{
  "data": {
    "rows": [
      {
        "items": [
          {
            "type": "text",
            "key": "text",
            "text": "lue lisää ja tilaa"
          }
        ],
        "pages": [
          "https://caars.fi/auton-etsinta",
          "https://caars.fi/maksupalvelu"
        ],
        "problems": [],
        "strikehash": 1130395509,
        "checked": false
      },
      {
        "items": [
          {
            "type": "text",
            "key": "text",
            "text": "ladataan... käsin valikoitu löytövapaa tuontiin"
          }
        ],
        "pages": [
          "https://caars.fi/market/car/audi-e-tron-gt-476hv-quattro-1779179705104",
          "https://caars.fi/market/car/demo-mercedes-benz-eqs-450-2022"
        ],
        "problems": [],
        "strikehash": 3438535350,
        "checked": false
      }
    ],
    "filters": []
  },
  "pagination": {
    "total": 4,
    "offset": 0,
    "limit": 100
  },
  "crawl_id": 16196143
}
```

### pages-with-keyword-cannibalization

```json
{
  "data": {
    "rows": [
      {
        "items": [
          {
            "type": "text",
            "key": "text",
            "text": "Audi"
          },
          {
            "type": "text",
            "key": "text",
            "text": "e-tron"
          }
        ],
        "pages": [
          "https://caars.fi/tuonti/audi-e-tron-tuonti-ruotsista",
          "https://caars.fi/market/car/audi-e-tron-gt-476hv-quattro-1779179705104",
          "https://caars.fi/tuonti/audi-q8-e-tron-tuonti-saksasta"
        ],
        "problems": [],
        "strikehash": null,
        "checked": false
      }
    ],
    "filters": []
  },
  "pagination": {
    "total": 1,
    "offset": 0,
    "limit": 100
  },
  "crawl_id": 16196143
}
```

### external-link-target-problems

```json
{
  "data": {
    "rows": [
      {
        "page": "https://wa.me/358400600609?text=Hei%21%20L%C3%B6ysin%20auton%20netist%C3%A4.%20Voitteko%20katsoa%20kannattaako%20t%C3%A4m%C3%A4%20ostaa%3F",
        "items": [
          {
            "type": "page",
            "page": "https://caars.fi/"
          }
        ],
        "problems": [
          {
            "name": "linkissue_hostchange",
            "value": "api.whatsapp.com"
          }
        ],
        "strikehash": 4038016632,
        "checked": false
      },
      {
        "page": "https://wa.me/358400600609?text=Hei%2C%20haluaisin%20kysy%C3%A4%20lis%C3%A4%C3%A4%20auton%20tuonnista",
        "items": [
          {
            "type": "page",
            "page": "https://caars.fi/"
          },
          {
            "type": "page",
            "page": "https://caars.fi/"
          },
          {
            "type": "page",
            "page": "https://caars.fi/"
          },
          {
            "type": "page",
            "page": "https://caars.fi/tietosuoja"
          },
          {
            "type": "page",
            "page": "https://caars.fi/tietosuoja"
          },
          {
            "type": "page",
            "page": "https://caars.fi/tietosuoja"
          },
          {
            "type": "page",
            "page": "https://caars.fi/palvelumme"
          },
          {
            "type": "page",
            "page": "https://caars.fi/palvelumme"
          },
          {
            "type": "page",
            "page": "https://caars.fi/palvelumme"
          },
          {
            "type": "page",
            "page": "https://caars.fi/syystarjous"
          }
        ],
        "problems": [
          {
            "name": "linkissue_hostchange",
            "value": "api.whatsapp.com"
          }
        ],
        "strikehash": 2920496519,
        "checked": false
      },
      {
        "page": "https://wa.me/358400600609?text=Hei%2C%20haluan%20kysy%C3%A4%20tuontiauton%20rahoituksesta%20ja%20vaihtoautosta.",
        "items": [
          {
            "type": "page",
            "page": "https://caars.fi/tuontiauton-rahoitus"
          }
        ],
        "problems": [
          {
            "name": "linkissue_hostchange",
            "value": "api.whatsapp.com"
          }
        ],
        "strikehash": 1059809823,
        "checked": false
      },
      {
        "page": "https://wa.me/358400600609",
        "items": [
          {
            "type": "page",
            "page": "https://caars.fi/tuontiauton-rahoitus"
          },
          {
            "type": "page",
            "page": "https://caars.fi/auto-rahoituksella"
          },
          {
            "type": "page",
            "page": "https://caars.fi/yhteystiedot"
          },
          {
            "type": "page",
            "page": "https://caars.fi/rahoitus-ja-vaihtoauto"
          },
          {
            "type": "page",
            "page": "https://caars.fi/blogi/autotuonti-rahoituksella"
          }
        ],
        "problems": [
          {
            "name": "linkissue_hostchange",
            "value": "api.whatsapp.com"
          }
        ],
        "strikehash": 3905732906,
        "checked": false
      },
      {
        "page": "https://wa.me/358400600609?text=Hei%2C%20haluan%20kuulla%20lis%C3%A4%C3%A4%20Maksupalvelusta%20%28149%20%E2%82%AC%29.",
        "items": [
          {
            "type": "page",
            "page": "https://caars.fi/maksupalvelu"
          }
        ],
        "problems": [
          {
            "name": "linkissue_hostchange",
            "value": "api.whatsapp.com"
          }
        ],
        "strikehash": 118237620,
        "checked": false
      },
      {
        "page": "https://www.mobile.de/",
        "items": [
          {
            "type": "page",
            "page": "https://caars.fi/auton-tuonti-saksasta"
          }
        ],
        "problems": [
          {
            "name": "linkissue_status",
            "value": 403
          }
        ],
        "strikehash": 2289335197,
        "checked": false
      },
      {
        "page": "https://www.vero.fi/henkiloasiakkaat/omaisuus/auto/",
        "items": [
          {
            "type": "page",
            "page": "https://caars.fi/blogi/auto-ruotsista-vai-saksasta-vertailu"
          }
        ],
        "problems": [
          {
            "name": "linkissue_status",
            "value": 404
          }
        ],
        "strikehash": 2219166833,
        "checked": false
      },
      {
        "page": "https://traficom.fi/fi/liikenne/tieliikenne",
        "items": [
          {
            "type": "page",
            "page": "https://caars.fi/blogi/auto-ruotsista-vai-saksasta-vertailu"
          }
        ],
        "problems": [
          {
            "name": "linkissue_status",
            "value": 404
          }
        ],
        "strikehash": 1226568667,
        "checked": false
      },
      {
        "page": "https://tulli.fi/rajoitukset/autot/auton-ostaminen",
        "items": [
          {
            "type": "page",
            "page": "https://caars.fi/blogi/auto-ruotsista-vai-saksasta-vertailu"
          }
        ],
        "problems": [
          {
            "name": "linkissue_status",
            "value": 403
          }
        ],
        "strikehash": 1778331474,
        "checked": false
      }
    ],
    "filters": {
      "linkissue_status": 4,
      "linkissue_down": 0,
      "linkissue_hostchange": 5,
      "linkissue_parking": 0,
      "linkissue_arecord": 0
    }
  },
  "pagination": {
    "total": 9,
    "offset": 0,
    "limit": 100
  },
  "crawl_id": 16196143
}
```

### pages-missing-the-title-content-in-the-body

```json
{
  "data": {
    "rows": [
      {
        "page": "https://caars.fi/yhteystiedot",
        "items": [
          {
            "type": "formatted_text",
            "key": "formatted_text",
            "formatted_text": {
              "raw": "Yhteystiedot – ota yhteyttä auton tuontiin | Caars.fi",
              "formatted": "Yhteystiedot – ota yhteyttä auton **tuontiin** \\| Caars\\.fi"
            },
            "properties": []
          }
        ],
        "problems": [],
        "strikehash": 2649884852,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/auton-osto-yksityiselta-ruotsista-blocket-riskit",
        "items": [
          {
            "type": "formatted_text",
            "key": "formatted_text",
            "formatted_text": {
              "raw": "Auton osto yksityiseltä Ruotsista – riskit ja ratkaisu | Caars.fi",
              "formatted": "Auton osto yksityiseltä Ruotsista – **riskit** ja ratkaisu \\| Caars\\.fi"
            },
            "properties": []
          }
        ],
        "problems": [],
        "strikehash": 833124231,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/bmw-tuonti-saksasta",
        "items": [
          {
            "type": "formatted_text",
            "key": "formatted_text",
            "formatted_text": {
              "raw": "BMW tuonti Saksasta – vinkit ja sudenkuopat | Caars.fi",
              "formatted": "BMW tuonti Saksasta – **vinkit** ja **sudenkuopat** \\| Caars\\.fi"
            },
            "properties": []
          }
        ],
        "problems": [],
        "strikehash": 2320091363,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/tuontiauto-suomeen",
        "items": [
          {
            "type": "formatted_text",
            "key": "formatted_text",
            "formatted_text": {
              "raw": "Tuontiauto Suomeen – kattava opas auton tuontiin | Caars.fi",
              "formatted": "Tuontiauto Suomeen – **kattava** opas auton tuontiin \\| Caars\\.fi"
            },
            "properties": []
          }
        ],
        "problems": [],
        "strikehash": 3203673437,
        "checked": false
      },
      {
        "page": "https://caars.fi/market",
        "items": [
          {
            "type": "formatted_text",
            "key": "formatted_text",
            "formatted_text": {
              "raw": "Caars Market – Autoja Ruotsista Suomeen | Caars.fi",
              "formatted": "Caars Market – Autoja Ruotsista **Suomeen** \\| Caars\\.fi"
            },
            "properties": []
          }
        ],
        "problems": [],
        "strikehash": 2430357726,
        "checked": false
      },
      {
        "page": "https://caars.fi/market/car/audi-e-tron-gt-476hv-quattro-1779179705104",
        "items": [
          {
            "type": "formatted_text",
            "key": "formatted_text",
            "formatted_text": {
              "raw": "Audi e-tron GT 476hv Quattro – auto Ruotsista | Caars Market",
              "formatted": "Audi e\\-tron GT 476hv Quattro – auto Ruotsista \\| Caars **Market**"
            },
            "properties": []
          }
        ],
        "problems": [],
        "strikehash": 1039693103,
        "checked": false
      },
      {
        "page": "https://caars.fi/market/car/demo-mercedes-benz-eqs-450-2022",
        "items": [
          {
            "type": "formatted_text",
            "key": "formatted_text",
            "formatted_text": {
              "raw": "Mercedes-Benz EQS 450+ 2022 – auto Ruotsista | Caars Market",
              "formatted": "Mercedes\\-Benz EQS 450\\+ 2022 – auto Ruotsista \\| Caars **Market**"
            },
            "properties": []
          }
        ],
        "problems": [],
        "strikehash": 1909360092,
        "checked": false
      }
    ],
    "filters": []
  },
  "pagination": {
    "total": 7,
    "offset": 0,
    "limit": 100
  },
  "crawl_id": 16196143
}
```

### pages-missing-the-h1-content-in-the-text

```json
{
  "data": {
    "rows": [
      {
        "page": "https://caars.fi/auto-rahoituksella",
        "items": [
          {
            "type": "formatted_text",
            "key": "formatted_text",
            "formatted_text": {
              "raw": "Tuontiauto rahoituksella – myös vaihtoauto onnistuu",
              "formatted": "Tuontiauto rahoituksella – myös vaihtoauto **onnistuu**"
            },
            "properties": []
          }
        ],
        "problems": [],
        "strikehash": 924407565,
        "checked": false
      },
      {
        "page": "https://caars.fi/auton-tuonti-hinta",
        "items": [
          {
            "type": "formatted_text",
            "key": "formatted_text",
            "formatted_text": {
              "raw": "Auton tuonti hinta – kaikki kustannukset selkeästi",
              "formatted": "Auton tuonti hinta – kaikki **kustannukset** **selkeästi**"
            },
            "properties": []
          }
        ],
        "problems": [],
        "strikehash": 344281949,
        "checked": false
      },
      {
        "page": "https://caars.fi/kannattaako-tuoda-auto",
        "items": [
          {
            "type": "formatted_text",
            "key": "formatted_text",
            "formatted_text": {
              "raw": "Kannattaako tuoda auto ulkomailta – rehellinen arvio",
              "formatted": "Kannattaako tuoda auto ulkomailta – **rehellinen** arvio"
            },
            "properties": []
          }
        ],
        "problems": [],
        "strikehash": 2848994202,
        "checked": false
      },
      {
        "page": "https://caars.fi/plug-in-hybrid-tuonti",
        "items": [
          {
            "type": "formatted_text",
            "key": "formatted_text",
            "formatted_text": {
              "raw": "Plug-in hybrid tuonti – parempi auto samalla rahalla",
              "formatted": "Plug\\-in hybrid tuonti – parempi auto **samalla** **rahalla**"
            },
            "properties": []
          }
        ],
        "problems": [],
        "strikehash": 3805793053,
        "checked": false
      },
      {
        "page": "https://caars.fi/autotuonti",
        "items": [
          {
            "type": "formatted_text",
            "key": "formatted_text",
            "formatted_text": {
              "raw": "Tilaa auto Ruotsista – me hoidamme tuonnin Suomeen",
              "formatted": "Tilaa auto Ruotsista – me **hoidamme** tuonnin Suomeen"
            },
            "properties": []
          }
        ],
        "problems": [],
        "strikehash": 605709513,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/tuontiauto-suomeen",
        "items": [
          {
            "type": "formatted_text",
            "key": "formatted_text",
            "formatted_text": {
              "raw": "Tuontiauto Suomeen – näin tuot auton ulkomailta oikein ja edullisesti",
              "formatted": "Tuontiauto Suomeen – näin tuot auton ulkomailta oikein ja **edullisesti**"
            },
            "properties": []
          }
        ],
        "problems": [],
        "strikehash": 3203673437,
        "checked": false
      },
      {
        "page": "https://caars.fi/market/car/audi-e-tron-gt-476hv-quattro-1779179705104",
        "items": [
          {
            "type": "formatted_text",
            "key": "formatted_text",
            "formatted_text": {
              "raw": "Audi e-tron GT 476hv Quattro",
              "formatted": "Audi e\\-tron GT **476hv** Quattro"
            },
            "properties": []
          }
        ],
        "problems": [],
        "strikehash": 1039693103,
        "checked": false
      }
    ],
    "filters": []
  },
  "pagination": {
    "total": 7,
    "offset": 0,
    "limit": 100
  },
  "crawl_id": 16196143
}
```

### pages-with-very-little-text-content

```json
{
  "data": {
    "rows": [
      {
        "page": "https://caars.fi/yhteystiedot",
        "items": [
          {
            "type": "number",
            "key": "number_of_words",
            "number_of_words": 388
          }
        ],
        "problems": [],
        "strikehash": 2649884852,
        "checked": false
      },
      {
        "page": "https://caars.fi/kayttoehdot",
        "items": [
          {
            "type": "number",
            "key": "number_of_words",
            "number_of_words": 477
          }
        ],
        "problems": [],
        "strikehash": 4234734482,
        "checked": false
      },
      {
        "page": "https://caars.fi/uutiset",
        "items": [
          {
            "type": "number",
            "key": "number_of_words",
            "number_of_words": 305
          }
        ],
        "problems": [],
        "strikehash": 1188834038,
        "checked": false
      },
      {
        "page": "https://caars.fi/market",
        "items": [
          {
            "type": "number",
            "key": "number_of_words",
            "number_of_words": 343
          }
        ],
        "problems": [],
        "strikehash": 2430357726,
        "checked": false
      },
      {
        "page": "https://caars.fi/market/car/audi-e-tron-gt-476hv-quattro-1779179705104",
        "items": [
          {
            "type": "number",
            "key": "number_of_words",
            "number_of_words": 399
          }
        ],
        "problems": [],
        "strikehash": 1039693103,
        "checked": false
      },
      {
        "page": "https://caars.fi/market/car/demo-mercedes-benz-eqs-450-2022",
        "items": [
          {
            "type": "number",
            "key": "number_of_words",
            "number_of_words": 376
          }
        ],
        "problems": [],
        "strikehash": 1909360092,
        "checked": false
      }
    ],
    "filters": []
  },
  "pagination": {
    "total": 6,
    "offset": 0,
    "limit": 100
  },
  "crawl_id": 16196143
}
```

### pages-with-duplicate-paragraphs

```json
{
  "data": {
    "rows": [
      {
        "page": "https://caars.fi/",
        "items": [
          {
            "type": "number",
            "key": "count",
            "count": 2
          }
        ],
        "problems": [],
        "strikehash": 3703511474,
        "checked": false
      },
      {
        "page": "https://caars.fi/tuontiapu",
        "items": [
          {
            "type": "number",
            "key": "count",
            "count": 2
          }
        ],
        "problems": [],
        "strikehash": 1516816759,
        "checked": false
      },
      {
        "page": "https://caars.fi/blogi/bmw-tuonti-saksasta",
        "items": [
          {
            "type": "number",
            "key": "count",
            "count": 2
          }
        ],
        "problems": [],
        "strikehash": 2320091363,
        "checked": false
      }
    ],
    "filters": []
  },
  "pagination": {
    "total": 3,
    "offset": 0,
    "limit": 100
  },
  "crawl_id": 16196143
}
```

### pages-with-few-internal-links

```json
{
  "data": {
    "rows": [
      {
        "page": "https://caars.fi/tuontiauton-rahoitus",
        "items": [
          {
            "type": "number",
            "key": "number_of_links",
            "number_of_links": 2
          }
        ],
        "problems": [],
        "strikehash": 1354545879,
        "checked": false
      }
    ],
    "filters": []
  },
  "pagination": {
    "total": 1,
    "offset": 0,
    "limit": 100
  },
  "crawl_id": 16196143
}
```

### internal-link-targets-on-redirects

```json
{
  "data": {
    "rows": [
      {
        "page": "https://caars.fi/volvo-tuonti-ruotsista",
        "items": [
          {
            "type": "page",
            "page": "https://caars.fi/tuonti/volvo-xc60-tuonti-ruotsista"
          }
        ],
        "pages": [
          "https://caars.fi/tilastokeskus"
        ],
        "problems": [],
        "strikehash": 4237788127,
        "checked": false
      },
      {
        "page": "https://caars.fi/market/ehdot",
        "items": [
          {
            "type": "page",
            "page": "https://caars.fi/"
          }
        ],
        "pages": [
          "https://caars.fi/market"
        ],
        "problems": [],
        "strikehash": 2468191333,
        "checked": false
      }
    ],
    "filters": []
  },
  "pagination": {
    "total": 2,
    "offset": 0,
    "limit": 100
  },
  "crawl_id": 16196143
}
```

### pages-with-duplicate-text-content

```json
{
  "data": {
    "rows": [
      {
        "items": [
          {
            "type": "text",
            "key": "text",
            "text": "Autoveroarvio on suuntaa-antava. Se perustuu Verohallinnon veroprosenttitaulukoihin ja arvioituun..."
          }
        ],
        "pages": [
          "https://caars.fi/market/car/audi-e-tron-gt-476hv-quattro-1779179705104",
          "https://caars.fi/market/car/demo-mercedes-benz-eqs-450-2022"
        ],
        "problems": [],
        "sublistitem": "22c5c2e0151f216929d45aa6e2653f16475f55d2",
        "strikehash": 2753183705,
        "checked": false
      },
      {
        "items": [
          {
            "type": "text",
            "key": "text",
            "text": "Kun hyväksyt tarjouksen ja rahoitus on hyväksytty, Caars hoitaa tuonnin Autohalli.comin toimeksia..."
          }
        ],
        "pages": [
          "https://caars.fi/rahoitus-ja-vaihtoauto",
          "https://caars.fi/blogi/autotuonti-rahoituksella"
        ],
        "problems": [],
        "sublistitem": "b5c76cf3f6fca81067627c80eb862dd85061fba3",
        "strikehash": 181274719,
        "checked": false
      }
    ],
    "filters": []
  },
  "pagination": {
    "total": 2,
    "offset": 0,
    "limit": 100
  },
  "crawl_id": 16196143
}
```

## Tallennus ja toteutusraja

Raportti tallennetaan Caarsin companion-repon docs/seo-kansioon ja Google Driven olemassa olevaan SEO Caars -kansioon. GitHub-yhteys pystyy lukemaan BraiGAIP/caars-backend-repoa. Verkkosivuston venturecore/caars-bright-spark-repon luku palautti 404; sen muokkausta ei ole varmennettu. Backend ei ole verkkosivuston lähdekoodi. Toteutus jatkuu verkkosivuston oikeassa lähteessä, kun yhteys on käytettävissä.
