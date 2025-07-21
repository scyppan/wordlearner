let wordsData = [
  {
    word: 'บ้าน',
    confidence: 1,
    romanization: 'bâan',
    type: 'content',
    pos: 'noun',
    definition: 'house/home',
    notes: '',
    shortphrases: ['ที่บ้าน', 'บ้านฉัน'],
    longphrases: ['ฉันอยู่ที่บ้าน'],
    sentences: ['ฉันกลับบ้านตอนเย็น']
  },
  {
    word: 'กิน',
    confidence: 5,
    romanization: 'gin',
    type: 'content',
    pos: 'verb',
    definition: 'to eat',
    notes: '',
    shortphrases: ['กินข้าว', 'กินน้ำ'],
    longphrases: ['ฉันกินข้าวแล้ว'],
    sentences: ['ฉันกินข้าวตอนเช้า']
  },
  {
    word: 'น้ำ',
    confidence: 7,
    romanization: 'náam',
    type: 'content',
    pos: 'noun',
    definition: 'water',
    notes: '',
    shortphrases: ['น้ำเย็น', 'น้ำร้อน'],
    longphrases: ['ฉันดื่มน้ำเย็น'],
    sentences: ['ฉันชอบดื่มน้ำ']
  },
  {
    word: 'เรียน',
    confidence: 3,
    romanization: 'rián',
    type: 'content',
    pos: 'verb',
    definition: 'to study/learn',
    notes: '',
    shortphrases: ['เรียนภาษาไทย', 'เรียนหนังสือ'],
    longphrases: ['ฉันเรียนภาษาไทยทุกวัน'],
    sentences: ['ฉันเรียนหนังสือที่โรงเรียน']
  },
  {
    word: 'แล้ว',
    confidence: 2,
    romanization: 'láew',
    type: 'functionary',
    pos: 'particle',
    definition: 'already/then',
    notes: '',
    shortphrases: ['ไปแล้ว', 'กินแล้ว'],
    longphrases: ['เขามาถึงแล้ว'],
    sentences: ['เขามาถึงแล้วเมื่อครู่']
  }
];

let quizzes = [
    {
        "title": "Quiz 25.07.21.001",
        "items": [
            {
                "itemNumber": 1,
                "thai": "บ้าน",
                "item": "บ้าน",
                "state": "not tested"
            },
            {
                "itemNumber": 2,
                "thai": "บ้าน",
                "item": "บ้านฉัน",
                "state": "not tested"
            },
            {
                "itemNumber": 3,
                "thai": "บ้าน",
                "item": "ที่บ้าน",
                "state": "not tested"
            },
            {
                "itemNumber": 4,
                "thai": "บ้าน",
                "item": "ฉันอยู่ที่บ้าน",
                "state": "not tested"
            },
            {
                "itemNumber": 5,
                "thai": "บ้าน",
                "item": "ฉันกลับบ้านตอนเย็น",
                "state": "not tested"
            },
            {
                "itemNumber": 6,
                "thai": "แล้ว",
                "item": "แล้ว",
                "state": "not tested"
            },
            {
                "itemNumber": 7,
                "thai": "แล้ว",
                "item": "ไปแล้ว",
                "state": "not tested"
            },
            {
                "itemNumber": 8,
                "thai": "แล้ว",
                "item": "กินแล้ว",
                "state": "not tested"
            },
            {
                "itemNumber": 9,
                "thai": "แล้ว",
                "item": "เขามาถึงแล้ว",
                "state": "not tested"
            },
            {
                "itemNumber": 10,
                "thai": "แล้ว",
                "item": "เขามาถึงแล้วเมื่อครู่",
                "state": "not tested"
            },
            {
                "itemNumber": 11,
                "thai": "เรียน",
                "item": "เรียน",
                "state": "not tested"
            },
            {
                "itemNumber": 12,
                "thai": "เรียน",
                "item": "เรียนหนังสือ",
                "state": "not tested"
            },
            {
                "itemNumber": 13,
                "thai": "เรียน",
                "item": "เรียนภาษาไทย",
                "state": "not tested"
            },
            {
                "itemNumber": 14,
                "thai": "เรียน",
                "item": "ฉันเรียนภาษาไทยทุกวัน",
                "state": "not tested"
            },
            {
                "itemNumber": 15,
                "thai": "เรียน",
                "item": "ฉันเรียนหนังสือที่โรงเรียน",
                "state": "not tested"
            },
            {
                "itemNumber": 16,
                "thai": "กิน",
                "item": "กิน",
                "state": "not tested"
            },
            {
                "itemNumber": 17,
                "thai": "กิน",
                "item": "กินน้ำ",
                "state": "not tested"
            },
            {
                "itemNumber": 18,
                "thai": "กิน",
                "item": "กินข้าว",
                "state": "not tested"
            },
            {
                "itemNumber": 19,
                "thai": "กิน",
                "item": "ฉันกินข้าวแล้ว",
                "state": "not tested"
            },
            {
                "itemNumber": 20,
                "thai": "กิน",
                "item": "ฉันกินข้าวตอนเช้า",
                "state": "not tested"
            },
            {
                "itemNumber": 21,
                "thai": "น้ำ",
                "item": "น้ำ",
                "state": "not tested"
            },
            {
                "itemNumber": 22,
                "thai": "น้ำ",
                "item": "น้ำเย็น",
                "state": "not tested"
            },
            {
                "itemNumber": 23,
                "thai": "น้ำ",
                "item": "น้ำร้อน",
                "state": "not tested"
            },
            {
                "itemNumber": 24,
                "thai": "น้ำ",
                "item": "ฉันดื่มน้ำเย็น",
                "state": "not tested"
            },
            {
                "itemNumber": 25,
                "thai": "น้ำ",
                "item": "ฉันชอบดื่มน้ำ",
                "state": "not tested"
            }
        ]
    },
    {
        "title": "Quiz 25.07.21.002",
        "items": [
            {
                "itemNumber": 1,
                "thai": "บ้าน",
                "item": "บ้าน",
                "state": "not tested"
            },
            {
                "itemNumber": 2,
                "thai": "บ้าน",
                "item": "ที่บ้าน",
                "state": "not tested"
            },
            {
                "itemNumber": 3,
                "thai": "บ้าน",
                "item": "บ้านฉัน",
                "state": "not tested"
            },
            {
                "itemNumber": 4,
                "thai": "บ้าน",
                "item": "ฉันอยู่ที่บ้าน",
                "state": "not tested"
            }
        ]
    }
]
