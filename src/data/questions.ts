import type { QuestionData, MolarGuide } from '../types';

export const QUESTIONS_DATA: QuestionData[] = [
  {
    trait: 'Eye Orientation',
    q: {
      en: 'Where are the eyes positioned on the skull?',
      si: 'ඇස් පිහිටා ඇත්තේ කපාලයෙහි කොතැනද?',
      ta: 'ஓட்டில் கண்கள் எங்கு அமைந்துள்ளன?'
    },
    hint: {
      en: 'Forward eyes suggest predators (depth perception); side eyes suggest prey (wide field of view).',
      si: 'ඉදිරිපස ඇස් විලෝපිකයන් (ගැඹුර හඳුනා ගැනීම) ද, පැති ඇස් ගොදුරු (පුළුල් දර්ශනය) ද දක්වයි.',
      ta: 'முன்பக்க கண்கள் வேட்டையாடுபவர்களைக் குறிக்கும்; பக்கவாட்டு கண்கள் இரையைக் குறிக்கும்.'
    },
    options: {
      'Forward': {
        en: 'Forward-facing (Predator/Binocular)',
        si: 'ඉදිරියට මුහුණ ලා (විලෝපික/ද්විත්ව නෙත්)',
        ta: 'முன்புறம் நோக்கிய (வேட்டை/இருவிழி)'
      },
      'Side': {
        en: 'Side-facing (Prey/Wide-angle)',
        si: 'පැත්තට මුහුණ ලා (ගොදුරු/පුළුල් කෝණ)',
        ta: 'பக்கவாட்டு நோக்கிய (இரை/அகன்ற கோணம்)'
      }
    }
  },
  {
    trait: 'Canine Development',
    q: {
      en: 'What is the development of the canine teeth?',
      si: 'රදනක දත් වර්ධනය වී ඇත්තේ කෙසේද?',
      ta: 'கோரைப்பற்கள் எவ்வாறு வளர்ந்துள்ளன?'
    },
    hint: {
      en: 'Large pointy canines are for stabbing prey. Absent canines leave a gap (diastema).',
      si: 'විශාල උල් රදනක දත් ගොදුරු අල්ලා ගැනීමටය. රදනක දත් නැති විට හිඩැසක් (diastema) පවතී.',
      ta: 'பெரிய கூர்மையான கோரைப்பற்கள் இரையைக் கொல்லப் பயன்படும். அவை இல்லாவிடில் இடைவெளி இருக்கும்.'
    },
    options: {
      'Large': {
        en: 'Large & Pointy (stabbing/tearing)',
        si: 'විශාල සහ උල් සහිත (ඉරා කෑමට)',
        ta: 'பெரிய & கூர்மையான (காயப்படுத்த/கிழிக்க)'
      },
      'Small': {
        en: 'Small / Reduced (defense/general)',
        si: 'කුඩා / ඌනිත (ආරක්ෂාවට/පොදු)',
        ta: 'சிறிய / குறைந்த அளவு (பாதுகாப்பு/பொது)'
      },
      'Absent': {
        en: 'Absent (creates a diastema gap)',
        si: 'නැත (හිඩැසක් නිර්මාණය කරයි)',
        ta: 'இல்லை (பல் இடைவெளி உருவாகும்)'
      }
    }
  },
  {
    trait: 'Molar Type',
    q: {
      en: 'What is the structure of the molars (back teeth)?',
      si: 'චර්වණක (පිටුපස දත්) වල ව්‍යුහය කුමක්ද?',
      ta: 'கடவாய்ப்பற்களின் அமைப்பு எவ்வாறு உள்ளது?'
    },
    hint: {
      en: 'Carnassials shear meat. Selenodont/Lophodont grind plants. Bunodont crush mixed food.',
      si: 'Carnassials මස් ඉරා කෑමටය. Selenodont/Lophodont ශාක ඇඹරීමටය. Bunodont මිශ්‍ර ආහාර තලා ගැනීමටය.',
      ta: 'கார்னாசியல் பற்கள் தசையைக் கிழிக்கும். செலிணோடன்ட்/லோபோடன்ட் தாவரங்களை அரைக்கும்.'
    },
    options: {
      'Carnassial': {
        en: 'Carnassial (blade-like shearing teeth for meat)',
        si: 'Carnassial (මස් කැපීම සඳහා බ්ලේඩ් වැනි දත්)',
        ta: 'கார்னாசியல் (இறச்சியைக் கிழிக்கும் கத்தி போன்ற பற்கள்)'
      },
      'Bunodont': {
        en: 'Bunodont (rounded cusps for crushing omnivore food)',
        si: 'Bunodont (මිශ්‍ර ආහාර තැලීමට වටකුරු දත්)',
        ta: 'புனோடண்ட் (அனைத்துண்ணி உணவுகளை நசுக்கும் வட்ட வடிவ பற்கள்)'
      },
      'Selenodont': {
        en: 'Selenodont (crescent ridges for grass/leaves)',
        si: 'Selenodont (තණකොළ/කොළ ඇඹරීමට අඩ සඳ හැඩැති රිජ්)',
        ta: 'செலிணோடன்ட் (புல்/இலைகளை அரைக்கும் பிறை வடிவ பற்கள்)'
      },
      'Lophodont': {
        en: 'Lophodont (flat washboard-like ridges for coarse plants)',
        si: 'Lophodont (තන්තුමය ශාක ඇඹරීමට පැතලි රිජ්)',
        ta: 'லோபோடன்ட் (கரடுமுரடான தாவரங்களை அரைக்கும் தட்டையான பற்கள்)'
      },
      'Mixed': {
        en: 'Mixed / Transitional (generalist grinding)',
        si: 'මිශ්‍ර / සංක්‍රාන්ති (පොදු ඇඹරීම)',
        ta: 'கலப்பு / இடைநிலை (பொதுவான அரைப்பு)'
      },
      'Absent': {
        en: 'Absent (completely toothless in molar region)',
        si: 'නැත (චර්වණක ප්‍රදේශයේ දත් කිසිවක් නැත)',
        ta: 'இல்லை (பற்கள் முற்றிலும் இல்லை)'
      }
    }
  },
  {
    trait: 'Jaw Length Ratio',
    q: {
      en: 'How long is the snout/jaw relative to the skull?',
      si: 'කපාලයට සාපේක්ෂව හනුව/නාසය කොතරම් දිගද?',
      ta: 'ஓட்டுடன் ஒப்பிடும்போது தாடை எவ்வளவு நீளமானது?'
    },
    hint: {
      en: 'Long jaws are typical of grazers and anteaters. Short jaws provide high leverage for biting.',
      si: 'දිගු හනු ශාක භක්ෂකයන්ට සහ වේයන් කන සතුන්ට පොදුය. කෙටි හනු වලින් වැඩි හපන බලයක් ලැබේ.',
      ta: 'நீண்ட தாடைகள் தாவர உண்ணிகளுக்கும் எறும்புண்ணிகளுக்கும் உரியது. குட்டையான தாடைகள் கடித்தலுக்கு உதவும்.'
    },
    options: {
      'Long': {
        en: 'Long snout (elongated face)',
        si: 'දිගු නාසය (දික් වූ මුහුණ)',
        ta: 'நீண்ட மூக்கு (நீட்டப்பட்ட முகம்)'
      },
      'Medium': {
        en: 'Medium snout (balanced proportions)',
        si: 'මධ්‍යම නාසය (සමබර ප්‍රමාණය)',
        ta: 'நடுத்தர மூக்கு (சீரான விகிதம்)'
      },
      'Short': {
        en: 'Short snout (compact face/high leverage)',
        si: 'කෙටි නාසය (කොට මුහුණ/වැඩි බලයක් සහිත)',
        ta: 'குட்டையான மூக்கு (சுருங்கிய முகம்)'
      }
    }
  },
  {
    trait: 'Skull Robustness',
    q: {
      en: 'How robust or heavily built is the skull?',
      si: 'කපාලය කොතරම් ශක්තිමත්ව හෝ ඝනව සෑදී තිබේද?',
      ta: 'ஓடு எவ்வளவு தடிமனாக அல்லது வலிமையாகக் கட்டமைக்கப்பட்டுள்ளது?'
    },
    hint: {
      en: 'Robust skulls support heavy bite forces (bears, pigs, large cats). Gracile skulls are lightweight.',
      si: 'ශක්තිමත් කපාල විශාල හපන බලයකට ඔරොත්තු දේ. Gracile කපාල සැහැල්ලුය.',
      ta: 'வலிமையான ஓடுகள் அதிக கடிக்கும் விசைக்கு உதவும். மெல்லிய ஓடுகள் இலகுவானவை.'
    },
    options: {
      'Robust': {
        en: 'Robust (thick bones, heavy ridges, large muscle sites)',
        si: 'Robust (ඝන අස්ථි, බර රිජ්, විශාල පේශි සන්ධාන)',
        ta: 'வலிமையான (தடிமனான எலும்புகள், தசை இணைப்புகள்)'
      },
      'Moderate': {
        en: 'Moderate (balanced bone thickness)',
        si: 'මධ්‍යස්ථ (සමබර අස්ථි ඝනකම)',
        ta: 'மிதமான (சீரான எலும்பு தடிமன்)'
      },
      'Gracile': {
        en: 'Gracile (delicate, thin bones, lightweight)',
        si: 'Gracile (සියුම්, තුනී අස්ථි, සැහැල්ලු)',
        ta: 'மென்மையான (மெல்லிய எலும்புகள், இலகுவானது)'
      }
    }
  },
  {
    trait: 'Body Size Class',
    q: {
      en: 'What is the general size class of the animal?',
      si: 'සතාගේ සාමාන්‍ය ශරීර ප්‍රමාණ පන්තිය කුමක්ද?',
      ta: 'விலங்கின் பொதுவான அளவு வகுப்பு என்ன?'
    },
    hint: {
      en: 'Small: mice, squirrels (<10kg). Medium: foxes, jackals (10-100kg). Large: leopards, tigers. Very Large: elephants, cows (>500kg).',
      si: 'කුඩා: මීයන්, ලේනුන් (<10kg). මධ්‍යම: නරියන් (10-100kg). විශාල: කොටියන්, වලිගයන්. ඉතා විශාල: අලින්, හරකුන් (>500kg).',
      ta: 'சிறிய: எலி, அணில் (<10kg). நடுத்தர: நரி, குள்ளநரி (10-100kg). பெரிய: புலி, சிறுத்தை. மிக பெரிய: யானை, மாடு (>500kg).'
    },
    options: {
      'Small': {
        en: 'Small (under 10 kg)',
        si: 'කුඩා (කිලෝග්‍රෑම් 10 ට අඩු)',
        ta: 'சிறிய (10 கிலோவிற்கு கீழ்)'
      },
      'Medium': {
        en: 'Medium (10 - 100 kg)',
        si: 'මධ්‍යම (කිලෝග්‍රෑම් 10 - 100)',
        ta: 'நடுத்தர (10 - 100 கிலோ)'
      },
      'Large': {
        en: 'Large (100 - 500 kg)',
        si: 'විශාල (කිලෝග්‍රෑම් 100 - 500)',
        ta: 'பெரிய (100 - 500 கிலோ)'
      },
      'VeryLarge': {
        en: 'Very Large (over 500 kg)',
        si: 'ඉතා විශාල (කිලෝග්‍රෑම් 500 ට වැඩි)',
        ta: 'மிக பெரிய (500 கிலோவிற்கு மேல்)'
      }
    }
  },
  {
    trait: 'Diet Category',
    q: {
      en: 'What is the animal\'s primary diet?',
      si: 'සතාගේ ප්‍රධාන ආහාර කාණ්ඩය කුමක්ද?',
      ta: 'விலங்கின் முக்கிய உணவு வகை என்ன?'
    },
    hint: {
      en: 'Primary food type. Insectivores eat insects, carnivores eat meat, herbivores eat plants.',
      si: 'ප්‍රධාන ආහාර වර්ගය. කෘමි භක්ෂකයන් කෘමීන් කන අතර, මාංශ භක්ෂකයන් මස් කයි.',
      ta: 'முக்கிய உணவு வகை. பூச்சியுண்ணி பூச்சிகளை உண்ணும், ஊனுண்ணி மாமிசம் உண்ணும்.'
    },
    options: {
      'Carnivore': {
        en: 'Carnivore (mainly meat/fish)',
        si: 'මාංශ භක්ෂක (ප්‍රධාන වශයෙන් මස්/මාළු)',
        ta: 'ஊனுண்ணி (முக்கியமாக மாமிசம்/மீன்)'
      },
      'Herbivore': {
        en: 'Herbivore (mainly grass/leaves/fruits)',
        si: 'ශාක භක්ෂක (ප්‍රධාන වශයෙන් තණකොළ/කොළ/ගෙඩි)',
        ta: 'தாவர உண்ணி (முக்கியமாக புல்/இலைகள்)'
      },
      'Omnivore': {
        en: 'Omnivore (generalist mixed diet)',
        si: 'මිශ්‍ර භක්ෂක (මස් සහ ශාක දෙකම)',
        ta: 'அனைத்துண்ணி (கலப்பு உணவு)'
      },
      'Insectivore': {
        en: 'Insectivore (mainly ants, termites, beetles)',
        si: 'කෘමි භක්ෂක (ප්‍රධාන වශයෙන් වේයන්, කෘමීන්)',
        ta: 'பூச்சியுண்ணி (முக்கியமாக எறும்பு, பூச்சிகள்)'
      }
    }
  },
  {
    trait: 'Habitat (Terrestrial)',
    q: {
      en: 'In which primary land habitat does the animal live?',
      si: 'සතා ජීවත් වන ප්‍රධාන ගොඩබිම් වාසස්ථානය කුමක්ද?',
      ta: 'விலங்கு வாழும் முக்கிய நில வாழிடம் எது?'
    },
    hint: {
      en: 'Where this species is naturally most successful.',
      si: 'මෙම විශේෂය ස්වභාවිකව වඩාත්ම සාර්ථකව ජීවත් වන ස්ථානය.',
      ta: 'இந்த விலங்கு இயற்கையாக எங்கு அதிகமாக வாழ்கிறது.'
    },
    options: {
      'Forest': {
        en: 'Forests / Woodlands / Jungles',
        si: 'වනාන්තර / කැලෑබද ප්‍රදේශ',
        ta: 'காடுகள் / அடர்ந்த மரங்கள்'
      },
      'Grassland': {
        en: 'Grasslands / Meadows / Plains',
        si: 'තණබිම් / විවෘත බිම්',
        ta: 'புல்வெளிகள் / சமவெளி நிலங்கள்'
      },
      'Savanna': {
        en: 'Savannas / Scrublands / Grasslands with scattered trees',
        si: 'සැවානා / වියළි පඳුරු බිම්',
        ta: 'சவன்னா / புதர் காடுகள்'
      },
      'Desert': {
        en: 'Deserts / Arid sandy or rocky zones',
        si: 'කාන්තාර / වියළි වැලි හෝ ගල් සහිත බිම්',
        ta: 'பாலைவனங்கள் / வறண்ட மணல் நிலம்'
      },
      'Generalist': {
        en: 'Generalist / Urban margins / Suburbs',
        si: 'පොදු අනුවර්තී / නාගරික ප්‍රදේශ / තදාසන්න බිම්',
        ta: 'பொதுவானவை / நகர ஓரங்கள்'
      },
      'Coastal': {
        en: 'Coastal shores / Beaches',
        si: 'මුහුදු වෙරළ / වෙරළබද ප්‍රදේශ',
        ta: 'கடற்கரை ஓரங்கள் / மணற்பாங்கான பகுதி'
      },
      'Aquatic/Generalist': {
        en: 'Freshwater margins / Riverbanks / Marshes',
        si: 'මිරිදිය තෙත් බිම් / ගංඟා ඉවුරු / වගුරු බිම්',
        ta: 'நன்னீர் ஓரங்கள் / சதுப்பு நிலங்கள்'
      }
    }
  },
  {
    trait: 'Social Structure',
    q: {
      en: 'What is the animal\'s typical social behavior?',
      si: 'සතාගේ සාමාන්‍ය සමාජයීය හැසිරීම කුමක්ද?',
      ta: 'விலங்கின் சமூக நடத்தை பொதுவாக எவ்வாறு இருக்கும்?'
    },
    hint: {
      en: 'Does it live alone, in pairs, in packs, or large herds?',
      si: 'එය තනිවම, ජෝඩු වශයෙන්, රැළවල් වශයෙන් හෝ විශාල රංචු වශයෙන් ජීවත් වේද?',
      ta: 'அது தனியாக, ஜோடியாக, கூட்டமாக அல்லது மந்தையாக வாழ்கிறதா?'
    },
    options: {
      'Solitary': {
        en: 'Solitary (lives & hunts alone)',
        si: 'හුදකලා (තනිවම ජීවත් වන සහ ගොදුරු සොයන)',
        ta: 'தனிமை (தனித்து வாழும்)'
      },
      'Pair': {
        en: 'Pair-bonding (lives in couples/families)',
        si: 'යුගල (ජෝඩු වශයෙන් / පවුලක් ලෙස)',
        ta: 'ஜோடி (ஜோடியாக/சிறு குடும்பமாக வாழும்)'
      },
      'Group': {
        en: 'Group / Pack / Pride (cooperative groups)',
        si: 'කණ්ඩායම් / රැළ (සහයෝගී කණ්ඩායම්)',
        ta: 'கூட்டம் / குழு (ஒன்றிணைந்து வாழும்)'
      },
      'Herd': {
        en: 'Herd (large numbers of grazing animals)',
        si: 'රංචු (විශාල ශාක භක්ෂක රංචු)',
        ta: 'மந்தை (பெரிய அளவிலான மேய்ச்சல் கூட்டம்)'
      }
    }
  },
  {
    trait: 'Activity Pattern',
    q: {
      en: 'When is the animal most active?',
      si: 'සතා වඩාත්ම ක්‍රියාශීලී වන්නේ කවදාද?',
      ta: 'விலங்கு எப்போது மிகவும் சுறுசுறுப்பாக இருக்கும்?'
    },
    hint: {
      en: 'Diurnal: daytime. Nocturnal: night. Crepuscular: dawn/dusk. Variable: active anytime.',
      si: 'දිවාචර: දහවල් කාලය. නිශාචර: රාත්‍රී කාලය. සන්ධ්‍යාචර: අලුයම/සැන්දෑව. විචල්‍ය: ඕනෑම වෙලාවක.',
      ta: 'பகலாடி: பகலில். இரவாடி: இரவில். அந்திநேர ஆடி: காலை/மாலை. மாறுபடக்கூடியது: எப்போதும்.'
    },
    options: {
      'Diurnal': {
        en: 'Diurnal (mostly active in daytime)',
        si: 'දිවාචර (දහවල් කාලයේ ක්‍රියාශීලී)',
        ta: 'பகலாடி (பகல் நேரத்தில் சுறுசுறுப்பானது)'
      },
      'Nocturnal': {
        en: 'Nocturnal (mostly active at night)',
        si: 'නිශාචර (රාත්‍රී කාලයේ ක්‍රියාශීලී)',
        ta: 'இரவாடி (இரவு நேரத்தில் சுறுசுறுப்பானது)'
      },
      'Crepuscular': {
        en: 'Crepuscular (dawn & dusk peaks)',
        si: 'සන්ධ්‍යාචර (අලුයම සහ සන්ධ්‍යා කාලයේ)',
        ta: 'அந்திநேர ஆடி (அதிகாலை & அந்திப்பொழுது)'
      },
      'Variable': {
        en: 'Variable / Cathemeral (both day and night activity)',
        si: 'විචල්‍ය (දිවා සහ රාත්‍රී දෙකේදීම)',
        ta: 'மாறுபடக்கூடியது (பகல் மற்றும் இரவு)'
      }
    }
  },
  {
    trait: 'Order',
    q: {
      en: 'Which mammalian group (Order) does it belong to?',
      si: 'එය අයත් වන්නේ කුමන ක්ෂීරපායී ගණයට (Order) ද?',
      ta: 'இது எந்த பாலூட்டி வகையைச் (வரிசை) சார்ந்தது?'
    },
    hint: {
      en: 'Broad taxonomic category. If unsure, look at the examples given in the options.',
      si: 'පුළුල් වර්ගීකරණ කාණ්ඩය. විශ්වාස නැතිනම් විකල්පයන්හි ඇති උදාහරණ බලන්න.',
      ta: 'பரந்த வகைப்பாடு. சந்தேகம் இருந்தால் விருப்பங்களில் உள்ள உதாரணங்களைப் பார்க்கவும்.'
    },
    options: {
      'Carnivora': {
        en: 'Carnivorans (cats, dogs, bears, mongooses, civets)',
        si: 'Carnivora (බළලුන්, බල්ලන්, වලසුන්, මුගටියන්, කලවැද්දන්)',
        ta: 'ஊனுண்ணிகள் (பூனை, நாய், கரடி, கீரி, புனுகுப்பூனை)'
      },
      'Rodentia': {
        en: 'Rodents (rats, mice, squirrels, porcupines)',
        si: 'Rodentia (මීයන්, ලේනුන්, ඉත්තෑවන්)',
        ta: 'எலிவகைகள் (எலி, அணில், முள்ளம்பன்றி)'
      },
      'Primates': {
        en: 'Primates (monkeys, langurs, lorises)',
        si: 'Primates (වඳුරන්, රිලවුන්, උණහපුලුවන්)',
        ta: 'விலங்கினங்கள் (குரங்கு, தேவாங்கு)'
      },
      'Artiodactyla': {
        en: 'Even-toed Ungulates (deer, cows, pigs, hippos, buffaloes)',
        si: 'Artiodactyla (මුවන්, හරකුන්, ඌරන්, දියකාවන්, මීහරකුන්)',
        ta: 'இரட்டைப்படைக் குளம்பிகள் (மான், மாடு, பன்றி, நீர்யானை)'
      },
      'Perissodactyla': {
        en: 'Odd-toed Ungulates (horses, rhinos, tapirs)',
        si: 'Perissodactyla (අශ්වයන්, රයිනෝසිරස්)',
        ta: 'ஒற்றைப்படைக் குளம்பிகள் (குதிரை, காண்டாமிருகம்)'
      },
      'Proboscidea': {
        en: 'Elephants',
        si: 'Proboscidea (අලින් / ඇතින්)',
        ta: 'யானைகள்'
      },
      'Pholidota': {
        en: 'Pangolins (scaly anteaters)',
        si: 'Pholidota (කබල්ලෑවන්)',
        ta: 'அழுங்கு (செதில் எறும்புண்ணி)'
      },
      'Eulipotyphla': {
        en: 'Insectivores (hedgehogs, shrews, moles)',
        si: 'Eulipotyphla (හෙජ්හොග්, හික්මීයන්)',
        ta: 'பூச்சியுண்ணிகள் (முள்ளெலி, மூஞ்சுறு)'
      },
      'Tubulidentata': {
        en: 'Aardvark',
        si: 'Tubulidentata (ආඩ්වර්ක්)',
        ta: 'ஆர்ட்வார்க்'
      },
      'Cingulata': {
        en: 'Armadillos',
        si: 'Cingulata (ආමඩිලෝ)',
        ta: 'அர்மடில்லோக்கள்'
      },
      'Pilosa': {
        en: 'Sloths & Anteaters',
        si: 'Pilosa (කලහකාරී කම්මැලි සතුන්, කුහුඹු කන්නන්)',
        ta: 'சோம்பேறிகள் & எறும்புண்ணிகள்'
      },
      'Diprotodontia': {
        en: 'Kangaroos, Koalas, Wombats',
        si: 'Diprotodontia (කැන්ගරු, කොවාලා, වොම්බැට්)',
        ta: 'கங்காரு, கோவாலா'
      },
      'Dasyuromorphia': {
        en: 'Tasmanian Devil, Carnivorous Marsupials',
        si: 'Dasyuromorphia (ටැස්මේනියානු යක්ෂයා, මාංශ භක්ෂක පැසැති සතුන්)',
        ta: 'டாஸ்மேனியன் டெவில்'
      },
      'Lagomorpha': {
        en: 'Rabbits, Hares, Pikas',
        si: 'Lagomorpha (හාවන්, පික්කා)',
        ta: 'முயல்கள்'
      }
    }
  }
];

export const MOLAR_GUIDE_DATA: Record<string, MolarGuide> = {
  'Carnassial': {
    name: 'Carnassial',
    description: {
      en: 'Blade-like, sharp teeth formed by the modification of the last upper premolar and first lower molar. They act like shears or scissors to slice through skin, flesh, and tendons.',
      si: 'මස්, හම සහ කණ්ඩරා කපා දැමීමට කතුරක් මෙන් ක්‍රියා කරන, උඩු හනුවේ අවසන් පුරශ්චර්වණකය සහ යටි හනුවේ පළමු චර්වණකය වෙනස් වීමෙන් සෑදුණු තල වැනි තියුණු දත් වේ.',
      ta: 'மேல் தாடையின் கடைசி முன் கடவாய்ப் பல்லும் கீழ் தாடையின் முதல் கடவாய்ப் பல்லும் இணைந்து உருவாகும் கத்தி போன்ற பற்கள். இவை இறைச்சியைக் கத்தரிக்கோல் போல் வெட்ட உதவும்.'
    },
    dietLink: {
      en: 'Adaptation for strict Carnivores (e.g., Cats, Dogs, Leopards, Mongooses) to process vertebrate prey.',
      si: 'මස් පමණක් අනුභව කරන මාංශ භක්ෂකයන් (උදා: බළලුන්, බල්ලන්, කොටියන්, මුගටියන්) සඳහා අනුවර්තනයකි.',
      ta: 'மாமிச உண்ணிகளுக்கு (எ.கா. பூனை, நாய், சிறுத்தை) இரையைக் கிழித்து உண்ண உதவும் முக்கிய தகவமைப்பு.'
    },
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" class="w-full h-full">
      <path d="M15,70 L30,45 L45,55 L70,25 L85,65 L70,55 L55,75 L35,60 Z" fill="rgba(239, 68, 68, 0.1)" stroke="#ef4444" />
      <path d="M15,70 L85,65" stroke="#ef4444" stroke-dasharray="3,3" />
      <text x="50" y="90" fill="#f8fafc" font-size="10" text-anchor="middle" font-weight="bold">Shearing / Scissors</text>
    </svg>`
  },
  'Selenodont': {
    name: 'Selenodont',
    description: {
      en: 'Teeth with crescent-shaped, longitudinal ridges (cusps) on the grinding surfaces. These wear down to expose sharp enamel edges running along the jaw, perfect for grinding tough fibers.',
      si: 'අඹරන පෘෂ්ඨයෙහි අඩ සඳ හැඩැති දිගටි රිජ් සහිත දත් වේ. දත් ගෙවී යාමේදී තියුණු එනමල් දාර නිරාවරණය වන අතර, එය තද ශාක කොටස් ඇඹරීමට කදිමය.',
      ta: 'பிறை வடிவிலான நீளமான முகடுகளைக் கொண்ட பற்கள். இவை தேயும்போது கூர்மையான எனாமல் விளிம்புகளை உருவாக்கி, கடினமான தாவர நார்ப்பொருட்களை அரைக்க உதவும்.'
    },
    dietLink: {
      en: 'Adaptation for Herbivores, especially ruminants (e.g., Deer, Cows, Antelopes) that chew cud and eat grasses/leaves.',
      si: 'වම්බුලන ශාක භක්ෂකයන් (උදා: මුවන්, හරකුන්, ගෝනුන්) සඳහා වන අනුවර්තනයකි.',
      ta: 'அசைபோடும் தாவர உண்ணிகளுக்கு (எ.கா. மான், மாடு) புல் மற்றும் இலைகளை அரைக்க உதவும் தகவமைப்பு.'
    },
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" class="w-full h-full">
      <path d="M20,40 Q35,20 50,40 Q65,20 80,40 Q65,60 50,40 Q35,60 20,40 Z" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" />
      <path d="M20,60 Q35,40 50,60 Q65,40 80,60 Q65,80 50,60 Q35,80 20,60 Z" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" />
      <text x="50" y="90" fill="#f8fafc" font-size="10" text-anchor="middle" font-weight="bold">Crescent Ridges</text>
    </svg>`
  },
  'Lophodont': {
    name: 'Lophodont',
    description: {
      en: 'Teeth with flat grinding surfaces characterized by transverse ridges (lophs) running perpendicular to the jaw. They act like grater files to pulverize highly abrasive plant material.',
      si: 'හනුවට සිරස්ව පිහිටි තීර්යක් රිජ් (lophs) සහිත පැතලි අඹරන මතුපිටක් ඇති දත් වේ. ඒවා රළු ශාක පදාර්ථ කුඩු කිරීමට ගොනුවක් මෙන් ක්‍රියා කරයි.',
      ta: 'தாடைக்குக் குறுக்காக அமைந்த தட்டையான அரைக்கும் முகடுகளைக் கொண்ட பற்கள். இவை கடினமான தாவரப் பொருட்களைப் பொடியாக்கும் ரம்பம் போல் செயல்படும்.'
    },
    dietLink: {
      en: 'Adaptation for large Herbivores and Rodents (e.g., Elephants, Horses, Porcupines, Rats) dealing with highly fibrous barks and seeds.',
      si: 'තන්තුමය ශාක කොටස්, පොතු, ඇට වර්ග ආහාරයට ගන්නා විශාල ශාක භක්ෂකයන් සහ මීයන් (උදා: අලින්, අශ්වයන්, ඉත්තෑවන්, මීයන්) සඳහා වන අනුවර්තනයකි.',
      ta: 'பெரிய தாவர உண்ணிகள் மற்றும் எலிவகைகளுக்கு (எ.கா. யானை, குதிரை, எலி) நார்ச்சத்துள்ள பட்டைகள் மற்றும் விதைகளை அரைக்க உதவும்.'
    },
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" class="w-full h-full">
      <rect x="15" y="25" width="70" height="50" rx="10" fill="rgba(6, 182, 212, 0.1)" stroke="#06b6d4" />
      <line x1="25" y1="35" x2="25" y2="65" stroke="#06b6d4" stroke-width="3" />
      <line x1="40" y1="35" x2="40" y2="65" stroke="#06b6d4" stroke-width="3" />
      <line x1="55" y1="35" x2="55" y2="65" stroke="#06b6d4" stroke-width="3" />
      <line x1="70" y1="35" x2="70" y2="65" stroke="#06b6d4" stroke-width="3" />
      <text x="50" y="90" fill="#f8fafc" font-size="10" text-anchor="middle" font-weight="bold">Transverse Ridges</text>
    </svg>`
  },
  'Bunodont': {
    name: 'Bunodont',
    description: {
      en: 'Teeth with rounded, separate cusps (hills) on the crown. They are designed for crushing food from all directions rather than shearing or grinding, ideal for varied diets.',
      si: 'කිරීටයෙහි වටකුරු, වෙන වෙනම පිහිටි ගැටිති සහිත දත් වේ. ශාක ඇඹරීමට හෝ මස් ඉරා කෑමට වඩා, සියලු දිශාවලින් ආහාර තලා ගැනීමට මෙය සැලසුම් කර ඇත.',
      ta: 'வட்டமான, தனித்தனியான மேடுகளைக் கொண்ட பற்கள். இவை உணவைக் கிழிப்பதற்கோ அரைப்பதற்கோ அல்லாமல், நசுக்கி உண்பதற்கு ஏற்றவை.'
    },
    dietLink: {
      en: 'Adaptation for Omnivores (e.g., Primates like Monkeys, Wild Boars, Pigs, Humans) eating fruit, roots, insects, and meat.',
      si: 'මිශ්‍ර භක්ෂකයන් (උදා: වඳුරන් වැනි ප්‍රයිමේටාවන්, වල් ඌරන්, මිනිසුන්) සඳහා වන අනුවර්තනයකි.',
      ta: 'அனைத்துண்ணிகளுக்கு (எ.கா. மனிதன், குரங்கு, பன்றி) பழங்கள், வேர்கள், பூச்சிகள் மற்றும் மாமிசத்தை நசுக்கி உண்ண உதவும்.'
    },
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" class="w-full h-full">
      <circle cx="35" cy="35" r="12" fill="rgba(245, 158, 11, 0.1)" stroke="#f59e0b" />
      <circle cx="65" cy="35" r="12" fill="rgba(245, 158, 11, 0.1)" stroke="#f59e0b" />
      <circle cx="35" cy="65" r="12" fill="rgba(245, 158, 11, 0.1)" stroke="#f59e0b" />
      <circle cx="65" cy="65" r="12" fill="rgba(245, 158, 11, 0.1)" stroke="#f59e0b" />
      <text x="50" y="90" fill="#f8fafc" font-size="10" text-anchor="middle" font-weight="bold">Rounded Cusps</text>
    </svg>`
  }
};
