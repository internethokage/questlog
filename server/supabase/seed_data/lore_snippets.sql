-- QuestLog Lore Snippets
-- Gear descriptions, battle fragments, hidden lore

-- ============================================
-- GEAR LORE (50+ Items)
-- ============================================

-- COMMON TIER (Helheim/Niflheim gear)
INSERT INTO lore_entries (lore_key, title, category, text) VALUES
('gear_rusty_dagger', 'Rusty Dagger', 'gear', 'A blade forgotten in the mists of Helheim. Its edge is dull, but it remembers sharper days. The runes etched into the hilt read: "Even the fallen may rise."'),
('gear_tattered_cloak', 'Tattered Cloak', 'gear', 'Worn by a Keeper who climbed halfway before giving up. The fabric is frayed, but it still offers warmth. A faint inscription inside: "One more step."'),
('gear_broken_shield', 'Broken Shield', 'gear', 'Cracked down the middle, this shield failed its bearer. But those who keep their oaths may find it mends over time.'),
('gear_ice_forged_blade', 'Ice-Forged Blade', 'gear', 'Forged in the frost of Niflheim, this blade never dulls. The cold tests all who wield it. Only the enduring survive.'),
('gear_frozen_gauntlets', 'Frozen Gauntlets', 'gear', 'These gauntlets were pulled from a frozen corpse. The previous owner stopped moving. You will not.'),

-- UNCOMMON TIER (Svartalfheim/Midgard gear)
('gear_dwarven_hammer', 'Dwarven Warhammer', 'gear', 'The dwarves say: "A tool is only as strong as the hand that wields it." This hammer has outlasted a hundred warriors. Will you be the hundred-and-first?'),
('gear_rune_carved_axe', 'Rune-Carved Axe', 'gear', 'Each rune carved into this blade represents a promise kept. The more you keep, the sharper it becomes.'),
('gear_miners_resolve', 'Miner''s Resolve', 'gear', 'A pick forged in Svartalfheim''s deepest mines. It has struck the same vein every day for a thousand years. Discipline outlasts inspiration.'),
('gear_mortal_steel', 'Mortal Steel Sword', 'gear', 'Crafted by human hands in Midgard. It lacks the magic of god-forged blades, but it has killed just as many monsters. Mortal determination is its own magic.'),
('gear_leather_of_endurance', 'Leather of Endurance', 'gear', 'Tanned from the hide of a beast that refused to die. Wearing it reminds you: survival is a choice.'),

-- RARE TIER (Jotunheim/Alfheim gear)
('gear_giant_bone_club', 'Giant-Bone Club', 'gear', 'Carved from the femur of a frost giant. The giants respect strength, not cleverness. This club speaks their language.'),
('gear_titanic_plate', 'Titanic Plate Armor', 'gear', 'Forged to fit a giant, but worn by a mortal. The weight is immense. Only those who carry it daily grow strong enough to bear it.'),
('gear_radiant_longsword', 'Radiant Longsword', 'gear', 'Blessed by the light elves of Alfheim. It shines brightest in the hands of those who never falter. Failure dims its glow.'),
('gear_perfectionist_mail', 'Perfectionist''s Mail', 'gear', 'The light elves crafted this armor to impossible standards. Every rivet, every plate, flawless. Wear it, and you will feel the weight of their expectations.'),
('gear_luminous_circlet', 'Luminous Circlet', 'gear', 'A crown of pure light. It grants clarity to the disciplined, but blinds the wavering. Perfection is both a gift and a curse.'),

-- EPIC TIER (Vanaheim/Muspelheim gear)
('gear_living_wood_bow', 'Living Wood Bow', 'gear', 'Grown, not carved, from the roots of Yggdrasil itself. It bends but never breaks. The Vanir say: "Flexibility is strength."'),
('gear_oath_keepers_blade', 'Oathkeeper''s Blade', 'gear', 'This sword was carried by the first Keepers. It has tasted the blood of ten thousand broken promises. In the hands of one who keeps their word, it is unbreakable.'),
('gear_flame_forged_greatsword', 'Flame-Forged Greatsword', 'gear', 'Quenched in the fires of Muspelheim. The heat never fades. Those who wield it are either tempered by discipline or consumed by flame.'),
('gear_surtr_gauntlets', 'Surtr''s Gauntlets', 'gear', 'Said to be fragments of the fire giant Surtr''s own armor. They burn with eternal flame. Only the worthy can wear them without being consumed.'),
('gear_molten_plate', 'Molten Plate Armor', 'gear', 'Forged in liquid fire, this armor never cools. It tests you daily: can you bear the heat, or will you remove it when comfort calls?'),

-- LEGENDARY TIER (Asgard gear + Prestige drops)
('gear_gungnir_echo', 'Gungnir''s Echo', 'gear', 'A spear forged in imitation of Odin''s legendary weapon. The original was said to never miss its mark. This one... sometimes does. But those who wield it with discipline may one day be worthy of the real thing.'),
('gear_mjolnir_fragment', 'Mjölnir''s Fragment', 'gear', 'A shard of Thor''s hammer, broken during Ragnarok. It hums with residual power. The gods say: "Even the mightiest may fall. What matters is rising again."'),
('gear_gleipnir_chain', 'Gleipnir Chain', 'gear', 'The chain that bound Fenrir. It was forged from six impossible things: the sound of a cat''s footfall, the beard of a woman, the roots of a mountain, the sinews of a bear, the breath of a fish, and the spittle of a bird. Discipline is no less impossible, yet here you are.'),
('gear_draupnir_ring', 'Draupnir''s Ring', 'gear', 'Odin''s ring, which produces eight new rings every ninth night. Wealth flows to those who prove worthy. But gold without discipline is a curse.'),
('gear_valhalla_plate', 'Valhalla Plate', 'gear', 'Armor worn by the Einherjar in Odin''s hall. Those who reach Valhalla are granted this as proof of their worth. You have earned it.'),

-- ============================================
-- BATTLE FRAGMENTS (Dropped after victories)
-- ============================================

('battle_helheim_draugr', 'The Forgotten Warrior', 'battle', 'The Draugr fell, whispering of oaths broken long ago. "I climbed once," it rasped. "I was so close." Its voice faded. "So... close."'),
('battle_niflheim_wraith', 'The Frozen One', 'battle', 'The Ice Wraith dissolved into mist. Before it vanished, it whispered: "The cold does not kill. Stopping does."'),
('battle_svartalfheim_golem', 'The Greed of Dwarves', 'battle', 'You struck down the Iron Golem. In its chest cavity, you found a single gold coin. Engraved on it: "We forge what we cannot buy."'),
('battle_midgard_bandit', 'The Fallen Mortal', 'battle', 'The bandit''s last words: "I was like you once. I had goals. Then one day I... I just stopped trying." He did not finish.'),
('battle_jotunheim_giant', 'The Giant''s Lesson', 'battle', 'The Frost Giant fell with a thunderous crash. As the ground shook, you heard its final words: "Strength fades. Discipline endures."'),
('battle_alfheim_sentinel', 'The Perfectionist', 'battle', 'The Radiant Sentinel shattered into light. Before it faded: "Perfection is impossible. Pursuit is eternal. Choose wisely."'),
('battle_vanaheim_druid', 'The Broken Bond', 'battle', 'The Corrupted Druid spoke before dying: "I once had allies. Friends. I pushed them away. Now I am alone." A warning, perhaps.'),
('battle_muspelheim_flame', 'The Forge''s Test', 'battle', 'The Flame Wraith dissipated. In the embers, you saw a vision: a blade being forged, heated, hammered, cooled. Over and over. "This is how gods are made," a voice whispered.'),
('battle_asgard_einherjar', 'The Worthy Foe', 'battle', 'You defeated one of Valhalla''s warriors. They smiled. "Well fought. You are ready." They dissolved into golden light. "Climb higher."'),

-- ============================================
-- REALM DISCOVERY LORE
-- ============================================

('realm_helheim_intro', 'Awakening in Helheim', 'realm', 'Cold. Mist. The weight of failure pressing down on you. This is Helheim, where forgotten warriors go. But you are not forgotten. Not yet. The Tree waits above. Climb.'),
('realm_niflheim_intro', 'The Frozen Wastes', 'realm', 'Niflheim tests endurance. The frost bites deeper here. Many who survive Helheim freeze in place, mid-climb. They stare upward, longing for the warmth of higher realms, but they cannot move. Do not be one of them.'),
('realm_svartalfheim_intro', 'The Dwarven Forges', 'realm', 'The sound of hammers echoes through Svartalfheim. The dwarves do not rest. They forge, day after day, perfecting their craft. They do not ask if you are worthy. They watch your hands. Do you work as they do?'),
('realm_midgard_intro', 'The Mortal Realm', 'realm', 'You have returned to Midgard. This is where you fell before. The world of mortals is loud, chaotic, distracting. It is easy to forget the climb here. Do not.'),
('realm_jotunheim_intro', 'The Land of Giants', 'realm', 'Jotunheim is raw power made manifest. The giants do not care about your intentions or your discipline. They test your strength. Prove it, or fall.'),
('realm_alfheim_intro', 'The Radiant Realm', 'realm', 'Alfheim blinds those who enter unprepared. The light elves demand perfection in all things. They do not forgive mistakes. Many climbers turn back here, dazzled and humbled. Will you be one of them?'),
('realm_vanaheim_intro', 'The Realm of Bonds', 'realm', 'Vanaheim is green, alive, vibrant. But the Vanir test something the other realms do not: your word. Have you kept your promises? To others? To yourself? The answer will determine if you pass.'),
('realm_muspelheim_intro', 'The Eternal Flame', 'realm', 'Fire roars in Muspelheim. This is the forge where gods are tempered. The heat is unbearable. Only those who endure daily trials can withstand it. Are you ready to burn?'),
('realm_asgard_intro', 'The Hall of Gods', 'realm', 'You have reached Asgard. The Hall of Valhalla stands before you, golden and eternal. But you are not yet worthy to enter. One final trial remains. Defeat the Fallen Allfather, and earn your place among the Einherjar.'),

-- ============================================
-- HIDDEN LORE (Easter Eggs)
-- ============================================

('hidden_yggdrasil_roots', 'The Roots Remember', 'hidden', 'Deep beneath Helheim, the roots of Yggdrasil drink from the Well of Fate. The Norns say: "Every climber is fated to fall. What is not fated is how many times you rise again."'),
('hidden_odin_sacrifice', 'Odin''s Sacrifice', 'hidden', 'Odin hung from Yggdrasil for nine days and nine nights, pierced by his own spear, to gain the knowledge of the runes. He gave his eye for wisdom. What are you willing to give for your climb?'),
('hidden_ragnarok_echo', 'The Echo of Ragnarok', 'hidden', 'The monsters you fight are not mere beasts. They are echoes of Ragnarok, the Twilight of the Gods. The Chaos you battle is the same Chaos that will one day consume even Asgard. But for now, you hold it back. One habit at a time.'),
('hidden_fenrir_binding', 'Fenrir''s Binding', 'hidden', 'Fenrir, the great wolf, was bound by Gleipnir, a chain made of impossible things. He struggled against it for eternity. You, too, are bound — by your habits, your discipline. But unlike Fenrir, your chains set you free.'),
('hidden_valhalla_truth', 'The Truth of Valhalla', 'hidden', 'Valhalla is not a reward for the strong. It is a promise to those who never stop fighting. The Einherjar are not perfect warriors. They are those who fell, and rose, and fell again, and rose again, until rising became their nature. That is you.');
