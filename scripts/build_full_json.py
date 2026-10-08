import json
from seq_1_100 import SEQ_1_TO_100
from seq_101_200 import SEQ_101_TO_200
from seq_201_300 import SEQ_201_TO_300
from seq_301_400 import SEQ_301_TO_400
from seq_401_500 import SEQ_401_TO_500

all_sequences = (
    SEQ_1_TO_100 +
    SEQ_101_TO_200 +
    SEQ_201_TO_300 +
    SEQ_301_TO_400 +
    SEQ_401_TO_500
)

assert len(all_sequences) == 500, f"Expected 500 sequences, got {len(all_sequences)}"

data = {
    "game": "TAPTA",
    "version": "1.0",
    "total_levels": 500,
    "initial_unlocked_levels": 4,
    "symbol_pool": ["#", "€", "¥", "$", "¢", "§", "∆"],
    "letter_pool": [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
        "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"
    ],
    "difficulty_blocks": [
        {"from": 1, "to": 100, "difficulty": "Facile"},
        {"from": 101, "to": 200, "difficulty": "Moyen"},
        {"from": 201, "to": 300, "difficulty": "Difficile"},
        {"from": 301, "to": 400, "difficulty": "Très difficile"},
        {"from": 401, "to": 500, "difficulty": "Expert"}
    ],
    "unlock_system": {
        "first_levels_free": 4,
        "after_level_4": "Require previous level success OR watch an ad to unlock the next level",
        "never_skip_progress": True
    },
    "levels": []
}

for i, seq in enumerate(all_sequences, start=1):
    if i <= 100:
        diff = "Facile"
        time_lim = 45
        if i <= 25:
            coins = 10
        elif i <= 50:
            coins = 15
        elif i <= 75:
            coins = 20
        else:
            coins = 25
        perf = 5 if i <= 50 else 10
    elif i <= 200:
        diff = "Moyen"
        time_lim = 40
        if i <= 125:
            coins = 30
        elif i <= 150:
            coins = 35
        elif i <= 175:
            coins = 40
        else:
            coins = 45
        perf = 15 if i <= 150 else 20
    elif i <= 300:
        diff = "Difficile"
        time_lim = 35
        if i <= 225:
            coins = 50
        elif i <= 250:
            coins = 55
        elif i <= 275:
            coins = 60
        else:
            coins = 65
        perf = 25 if i <= 250 else 30
    elif i <= 400:
        diff = "Très difficile"
        time_lim = 30
        if i <= 325:
            coins = 70
        elif i <= 350:
            coins = 75
        elif i <= 375:
            coins = 80
        else:
            coins = 85
        perf = 35 if i <= 350 else 40
    else:
        diff = "Expert"
        time_lim = 25
        if i <= 425:
            coins = 90
        elif i <= 450:
            coins = 95
        elif i <= 475:
            coins = 100
        else:
            coins = 105
        perf = 45 if i <= 450 else 50

    if i == 1:
        status = "unlocked"
    elif i <= 4:
        status = "initially_unlocked"
    else:
        status = "locked"

    stars = 3 if i % 5 == 0 else 1
    unlock_rule = "Disponible au lancement" if i <= 4 else "Niveau précédent réussi"
    ad_allowed = False if i <= 4 else True

    lvl = {
        "id": i,
        "name": f"Niveau {i}",
        "difficulty": diff,
        "status": status,
        "sequence": seq,
        "sequence_length": len(seq),
        "time_limit_seconds": time_lim,
        "reward_coins": coins,
        "reward_stars": stars,
        "unlock_rule": unlock_rule,
        "ad_unlock_allowed": ad_allowed,
        "hint_allowed": True,
        "perfect_bonus": perf
    }
    data["levels"].append(lvl)

# Write to both locations
with open("src/data/TAPTA_500_niveaux.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open("TAPTA_500_niveaux.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Successfully generated TAPTA_500_niveaux.json with {len(data['levels'])} levels!")
