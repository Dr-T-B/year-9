-- ============================================================
-- SEED: chem_content
-- Reference material for all 43 Chemistry skills
-- Types: definition | concept | equation | worked_example |
--        mnemonic | common_error
-- ============================================================

-- ══════════════════════════════════════════════════════════════
-- TOPIC 1: Physical Changes
-- ══════════════════════════════════════════════════════════════

-- T1-01: Three states of matter
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Solid: particles are closely packed in fixed positions, can only vibrate, lowest energy. Liquid: particles are close but can move past each other, medium energy. Gas: particles are far apart, move rapidly in all directions, highest energy.' from public.chem_skills where skill_ref = 'T1-01';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Students often say particles in solids do not move at all — they do vibrate in their fixed positions. Only their positions are fixed, not their motion.' from public.chem_skills where skill_ref = 'T1-01';

-- T1-02: Names of interconversions
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Melting: solid → liquid. Freezing: liquid → solid. Evaporation/Boiling: liquid → gas. Condensation: gas → liquid. Sublimation: solid → gas directly (e.g. iodine, dry ice).' from public.chem_skills where skill_ref = 'T1-02';
insert into public.chem_content (skill_id, type, content) select id, 'mnemonic', 'Going UP in energy (absorbing heat): melting, boiling, sublimation. Going DOWN in energy (releasing heat): freezing, condensation, deposition.' from public.chem_skills where skill_ref = 'T1-02';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Confusing evaporation with boiling — evaporation happens at the surface only at any temperature; boiling happens throughout the liquid at the boiling point.' from public.chem_skills where skill_ref = 'T1-02';

-- T1-03: How interconversions are achieved
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Heating gives particles more kinetic energy. When energy is sufficient, particles overcome the attractive forces between them and change state. Cooling removes energy — particles slow down and intermolecular forces pull them back together into a more ordered arrangement.' from public.chem_skills where skill_ref = 'T1-03';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Saying "temperature changes" without explaining the particle-level energy change. Exam answers must link energy input/removal to the breaking or forming of forces between particles.' from public.chem_skills where skill_ref = 'T1-03';

-- T1-04: Particle changes at interconversions
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'At melting: particles gain enough energy to break free from fixed positions but remain close — arrangement becomes disordered, movement increases. At boiling: particles gain enough energy to overcome all intermolecular forces — they spread far apart and move freely in all directions. The particles themselves do not change size or nature.' from public.chem_skills where skill_ref = 'T1-04';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Saying the particles get bigger or change when heated — only the arrangement, movement and energy of particles change. The particles themselves stay the same.' from public.chem_skills where skill_ref = 'T1-04';

-- T1-05: Heating and cooling curves
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'A heating curve plots temperature against time. Flat sections (plateaus) occur at the melting point and boiling point. During a plateau, energy input is used to break the forces between particles — not to increase temperature. Temperature only rises when no state change is occurring.' from public.chem_skills where skill_ref = 'T1-05';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'For water: first plateau at 0°C = melting (ice → water, energy breaks the lattice). Second plateau at 100°C = boiling (water → steam, energy overcomes all intermolecular forces). Between plateaus, temperature rises as energy increases kinetic energy of the particles.' from public.chem_skills where skill_ref = 'T1-05';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Thinking temperature always rises when heat is applied. During a change of state, all energy goes into breaking forces between particles — temperature stays constant until the state change is complete.' from public.chem_skills where skill_ref = 'T1-05';

-- T1-06: Diffusion and temperature
insert into public.chem_content (skill_id, type, content) select id, 'definition', 'Diffusion is the net movement of particles from a region of high concentration to a region of low concentration, due to random particle motion.' from public.chem_skills where skill_ref = 'T1-06';
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Particles move randomly in all directions. The net movement from high to low concentration happens because there are more particles colliding outward from the high-concentration region. Higher temperature gives particles more kinetic energy, so they move faster — the rate of diffusion increases.' from public.chem_skills where skill_ref = 'T1-06';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'Bromine gas diffusing into air: brown colour spreads as particles move randomly. In hot water vs cold water: food colouring spreads faster in hot water because particles have more kinetic energy and move more quickly.' from public.chem_skills where skill_ref = 'T1-06';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Saying particles "want to" move to low concentration or are "attracted" there. Particles move randomly — the net movement to low concentration is a statistical result of random motion, not a directed force.' from public.chem_skills where skill_ref = 'T1-06';

-- T1-07: Dilution
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Dilution means adding more solvent (e.g. water) to a solution. The number of solute particles stays the same but they are spread through a greater volume — so the concentration (number of particles per unit volume) decreases. The particles become more spread out.' from public.chem_skills where skill_ref = 'T1-07';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Saying dilution destroys or removes particles. The solute particles are still present — they are just more spread out in a larger volume of solvent.' from public.chem_skills where skill_ref = 'T1-07';

-- ══════════════════════════════════════════════════════════════
-- TOPIC 2: Atoms and Elements
-- ══════════════════════════════════════════════════════════════

-- T2-01: Subatomic particles
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Proton: in the nucleus, relative mass = 1, charge = +1. Neutron: in the nucleus, relative mass = 1, charge = 0. Electron: in shells around the nucleus, relative mass = negligible (1/1840), charge = -1. The number of protons equals the number of electrons in a neutral atom.' from public.chem_skills where skill_ref = 'T2-01';
insert into public.chem_content (skill_id, type, content) select id, 'mnemonic', 'PEN: Proton (+), Electron (-), Neutron (0). Protons and Neutrons are in the Nucleus. Electrons orbit outside.' from public.chem_skills where skill_ref = 'T2-01';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Giving electrons a relative mass of 1. Electron mass is negligible (approximately 1/1840 of a proton). For calculations, electron mass is taken as zero.' from public.chem_skills where skill_ref = 'T2-01';

-- T2-02: Mass number, atomic number, isotope
insert into public.chem_content (skill_id, type, content) select id, 'definition', 'Atomic number (proton number): the number of protons in the nucleus — this defines the element. Mass number: the total number of protons plus neutrons in the nucleus. Isotopes: atoms of the same element with the same atomic number but different mass numbers due to different numbers of neutrons.' from public.chem_skills where skill_ref = 'T2-02';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'Carbon-12 and Carbon-14 are isotopes: both have atomic number 6 (6 protons) but C-12 has 6 neutrons and C-14 has 8 neutrons. Same element, different mass numbers.' from public.chem_skills where skill_ref = 'T2-02';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Confusing mass number with atomic number. Atomic number is always the smaller number and defines which element it is. Mass number is always equal to or greater than atomic number.' from public.chem_skills where skill_ref = 'T2-02';

-- T2-03: Classify as element
insert into public.chem_content (skill_id, type, content) select id, 'definition', 'An element is a substance made of only one type of atom. It cannot be broken down into simpler substances by chemical means. All elements are listed in the Periodic Table.' from public.chem_skills where skill_ref = 'T2-03';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Thinking elements must consist of single atoms. Elements can exist as molecules (O2, N2, Cl2) but still contain only one type of atom. A substance is an element if all its atoms have the same atomic number.' from public.chem_skills where skill_ref = 'T2-03';

-- T2-04: Electron configurations
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Electrons fill shells in order from the nucleus outward. Shell 1: maximum 2 electrons. Shell 2: maximum 8 electrons. Shell 3: maximum 8 electrons (for the first 20 elements). Write electron configurations as numbers separated by commas.' from public.chem_skills where skill_ref = 'T2-04';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'Sodium (atomic number 11): 11 electrons arranged as 2, 8, 1. Calcium (atomic number 20): 20 electrons arranged as 2, 8, 8, 2. Chlorine (atomic number 17): 2, 8, 7.' from public.chem_skills where skill_ref = 'T2-04';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Putting more than 2 electrons in the first shell or more than 8 in the second shell. Also forgetting that the third shell holds a maximum of 8 for the first 20 elements (even though it can hold 18 beyond that).' from public.chem_skills where skill_ref = 'T2-04';

-- T2-05: Atomic structure and Periodic Table position
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Group number = number of electrons in the outer shell. Period number = number of electron shells. This explains why elements in the same group have similar chemical properties — they have the same number of outer electrons and react in similar ways.' from public.chem_skills where skill_ref = 'T2-05';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'Sodium (2,8,1): 1 outer electron → Group 1; 3 shells → Period 3. Chlorine (2,8,7): 7 outer electrons → Group 7; 3 shells → Period 3. Calcium (2,8,8,2): 2 outer electrons → Group 2; 4 shells → Period 4.' from public.chem_skills where skill_ref = 'T2-05';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Confusing group and period. Group = vertical column (same number of outer electrons). Period = horizontal row (same number of shells). Group number gives outer electrons; period number gives number of shells.' from public.chem_skills where skill_ref = 'T2-05';

-- T2-06: Arrangement in the Periodic Table
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Elements are arranged in order of increasing atomic number. Vertical columns are called groups (numbered 1–7 and 0/8). Horizontal rows are called periods. A diagonal zigzag line separates metals (left and centre) from non-metals (top right).' from public.chem_skills where skill_ref = 'T2-06';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Saying elements are arranged by mass number or atomic mass. The Periodic Table is ordered by atomic number (number of protons), not mass number.' from public.chem_skills where skill_ref = 'T2-06';

-- T2-07: Identify metals and non-metals
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Metals: left and centre of the Periodic Table, including all transition metals. Non-metals: top right of the Periodic Table. Hydrogen is a non-metal despite being in Group 1. Metalloids (e.g. silicon, germanium) sit along the diagonal boundary and have intermediate properties.' from public.chem_skills where skill_ref = 'T2-07';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Classifying hydrogen as a metal because it is in Group 1. Hydrogen is a non-metal — it does not have metallic properties and is a gas at room temperature.' from public.chem_skills where skill_ref = 'T2-07';

-- T2-08: Relative atomic mass from isotopic abundance
insert into public.chem_content (skill_id, type, content) select id, 'definition', 'Relative atomic mass (Ar) is the weighted mean mass of an atom of an element relative to 1/12 the mass of a carbon-12 atom. It accounts for the proportions of each naturally occurring isotope.' from public.chem_skills where skill_ref = 'T2-08';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'Chlorine has two isotopes: Cl-35 (75% abundance) and Cl-37 (25% abundance). Ar = (35 × 75 + 37 × 25) ÷ 100 = (2625 + 925) ÷ 100 = 3550 ÷ 100 = 35.5' from public.chem_skills where skill_ref = 'T2-08';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Simply averaging the mass numbers without weighting by abundance. Must multiply each mass number by its percentage abundance, sum the results, then divide by 100.' from public.chem_skills where skill_ref = 'T2-08';

-- ══════════════════════════════════════════════════════════════
-- TOPIC 3: Ions
-- ══════════════════════════════════════════════════════════════

-- T3-01: Compound
insert into public.chem_content (skill_id, type, content) select id, 'definition', 'A compound is a substance made of two or more different elements chemically bonded together in fixed ratios. The elements can only be separated by chemical reactions, not physical means.' from public.chem_skills where skill_ref = 'T3-01';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Confusing compound with mixture. In a compound, elements are chemically bonded in fixed ratios and have different properties from the constituent elements. In a mixture, substances are not bonded and can be separated by physical means.' from public.chem_skills where skill_ref = 'T3-01';

-- T3-02: Word equations
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Reactants go on the left, products on the right, with an arrow meaning "reacts to form" in the middle. Word equations use the full names of substances, not symbols or formulae.' from public.chem_skills where skill_ref = 'T3-02';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'hydrochloric acid + sodium hydroxide → sodium chloride + water. magnesium + sulfuric acid → magnesium sulfate + hydrogen.' from public.chem_skills where skill_ref = 'T3-02';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Writing chemical symbols or formulae in a word equation. Word equations use full names only — no symbols, no subscripts.' from public.chem_skills where skill_ref = 'T3-02';

-- T3-03: Ion formation
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Metals lose electrons to form positive ions called cations. Non-metals gain electrons to form negative ions called anions. The number of electrons lost or gained equals the magnitude of the charge on the ion. The nucleus does not change — only electrons are transferred.' from public.chem_skills where skill_ref = 'T3-03';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'Na → Na⁺ + e⁻ (sodium loses 1 electron, forms a 1+ ion). Cl + e⁻ → Cl⁻ (chlorine gains 1 electron, forms a 1- ion). Mg → Mg²⁺ + 2e⁻ (magnesium loses 2 electrons, forms a 2+ ion). O + 2e⁻ → O²⁻ (oxygen gains 2 electrons, forms a 2- ion).' from public.chem_skills where skill_ref = 'T3-03';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Saying the nucleus changes when ions form. Only electrons are transferred — the number of protons (and therefore the element identity) stays exactly the same.' from public.chem_skills where skill_ref = 'T3-03';

-- T3-04: Similar properties in same group
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Elements in the same group have the same number of electrons in their outer shell. Since chemical reactions involve the outer electrons, elements in the same group react in similar ways and form similar types of compounds. Reactivity changes down the group due to increasing atomic radius and shielding.' from public.chem_skills where skill_ref = 'T3-04';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Saying all elements in a group are identical or have the same reactivity. Same-group elements have similar properties, not identical ones. Reactivity changes down the group (increases for Group 1, decreases for Group 7).' from public.chem_skills where skill_ref = 'T3-04';

-- T3-05: Dot-and-cross diagrams
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Show only the outer shell electrons of each atom as dots (from one atom) and crosses (from the other atom). The electron(s) transfer from the metal to the non-metal. Draw the resulting ions in square brackets with the charge shown outside the bracket. Both ions should have a full outer shell (8 electrons, or 2 for the first shell).' from public.chem_skills where skill_ref = 'T3-05';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'Sodium chloride (NaCl): Na has 1 outer electron (dot). Cl has 7 outer electrons (crosses). The dot transfers from Na to Cl. Result: [Na]⁺ (empty outer shell) and [Cl]⁻ (now 8 outer electrons, full shell). Both ions drawn in square brackets with charges outside.' from public.chem_skills where skill_ref = 'T3-05';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Drawing all electron shells, not just the outer shell. Dot-and-cross diagrams for ionic bonding show only the outer shell electrons. Also: forgetting the square brackets and charges on the ions.' from public.chem_skills where skill_ref = 'T3-05';

-- T3-06: Ionic charges
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Group 1 metals: 1+ (Li⁺, Na⁺, K⁺). Group 2 metals: 2+ (Mg²⁺, Ca²⁺). Group 3 metals: 3+ (Al³⁺). Group 5 non-metals: 3- (N³⁻). Group 6 non-metals: 2- (O²⁻, S²⁻). Group 7 non-metals: 1- (F⁻, Cl⁻, Br⁻, I⁻). Special metals: Ag⁺, Cu²⁺, Fe²⁺, Fe³⁺, Pb²⁺, Zn²⁺. Polyatomic ions: H⁺, OH⁻, NH₄⁺, CO₃²⁻, NO₃⁻, SO₄²⁻.' from public.chem_skills where skill_ref = 'T3-06';
insert into public.chem_content (skill_id, type, content) select id, 'mnemonic', 'Group number gives the charge for main group elements: Group 1 loses 1 electron = 1+. Group 2 loses 2 = 2+. Non-metals gain electrons to complete their shell: Group 7 needs 1 more = 1-. Group 6 needs 2 more = 2-. Group 5 needs 3 more = 3-.' from public.chem_skills where skill_ref = 'T3-06';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Confusing the charges of iron ions (Fe²⁺ vs Fe³⁺) or copper ions (Cu²⁺ vs Cu⁺). The Roman numeral in the name tells you the charge — iron(II) = Fe²⁺, iron(III) = Fe³⁺, copper(II) = Cu²⁺.' from public.chem_skills where skill_ref = 'T3-06';

-- T3-07: Write formulae for ionic compounds
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'The overall charge of an ionic compound must be zero. Use the "cross and swap" method: swap the numbers of the charges to find the ratio of ions, then simplify. The ion with the positive charge is written first.' from public.chem_skills where skill_ref = 'T3-07';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'Calcium chloride: Ca²⁺ and Cl⁻. Cross the charges: 2 Cl⁻ needed for each Ca²⁺. Formula: CaCl₂. Iron(III) oxide: Fe³⁺ and O²⁻. Cross: 2 Fe and 3 O. Formula: Fe₂O₃. Ammonium sulfate: NH₄⁺ and SO₄²⁻. Ratio 2:1. Formula: (NH₄)₂SO₄ — brackets needed around polyatomic ion.' from public.chem_skills where skill_ref = 'T3-07';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Not simplifying the ratio — writing Ca₂Cl₄ instead of CaCl₂. Also forgetting brackets around polyatomic ions when more than one is needed, e.g. (OH)₂ not OH₂.' from public.chem_skills where skill_ref = 'T3-07';

-- T3-08: Balanced symbol equations
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Atoms must be conserved — the same number of each element must appear on both sides. Add coefficients (large numbers in front of formulae) to balance. Never change subscripts (small numbers within formulae) as this changes the substance. State symbols: (s) solid, (l) liquid, (g) gas, (aq) aqueous solution.' from public.chem_skills where skill_ref = 'T3-08';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'Balance H₂ + O₂ → H₂O. Count: left 2H, 2O; right 2H, 1O. Balance O: H₂ + O₂ → 2H₂O. Recount: left 2H; right 4H. Balance H: 2H₂ + O₂ → 2H₂O. Final check: 4H and 2O on each side. Balanced.' from public.chem_skills where skill_ref = 'T3-08';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Changing subscripts to balance instead of adding coefficients. Changing a subscript changes the chemical substance entirely — only coefficients (numbers in front) can be adjusted to balance an equation.' from public.chem_skills where skill_ref = 'T3-08';

-- T3-09: Flame test procedure
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Step 1: Clean a nichrome wire loop by dipping in concentrated hydrochloric acid and holding in the blue Bunsen flame until no colour is produced. Step 2: Dip the clean wire into the sample solution or solid. Step 3: Hold the wire in the blue part of the Bunsen burner flame. Step 4: Observe and record the colour produced.' from public.chem_skills where skill_ref = 'T3-09';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Not cleaning the wire between tests. Contamination from a previous sample produces a false colour — especially problematic with sodium, which gives a persistent bright yellow that can mask other colours.' from public.chem_skills where skill_ref = 'T3-09';

-- T3-10: Flame test colours
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Lithium (Li⁺): red flame. Sodium (Na⁺): yellow/orange flame. Potassium (K⁺): lilac/violet flame. Calcium (Ca²⁺): orange-red flame. Copper (Cu²⁺): blue-green flame.' from public.chem_skills where skill_ref = 'T3-10';
insert into public.chem_content (skill_id, type, content) select id, 'mnemonic', 'Li Red, Na Yellow, K liLac, Ca orange-Red, Cu Blue-green. "Little Naughty Kids Can Be" — Li, Na, K, Ca, Cu — Red, Yellow, liLac, orange-Red, Blue-green.' from public.chem_skills where skill_ref = 'T3-10';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Confusing calcium (orange-red) with sodium (yellow) or lithium (red). Calcium gives a deeper orange-red; sodium is a bright distinctive yellow. Potassium gives a faint lilac that can be hard to see if sodium contamination is present.' from public.chem_skills where skill_ref = 'T3-10';

-- T3-11: Cation tests using NaOH
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Ammonium (NH₄⁺): add NaOH solution and warm gently → ammonia gas (NH₃) is evolved → test with damp red litmus paper → turns blue. Copper(II) (Cu²⁺): add NaOH solution → blue precipitate (copper hydroxide, Cu(OH)₂). Iron(II) (Fe²⁺): add NaOH → green precipitate (iron(II) hydroxide, Fe(OH)₂). Iron(III) (Fe³⁺): add NaOH → brown/rust precipitate (iron(III) hydroxide, Fe(OH)₃).' from public.chem_skills where skill_ref = 'T3-11';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Confusing iron(II) green precipitate with iron(III) brown precipitate. Fe²⁺ = green, Fe³⁺ = brown/rust. Also: for ammonium, must warm the mixture AND test the gas with damp red litmus — two steps required.' from public.chem_skills where skill_ref = 'T3-11';

-- T3-12: Anion tests
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Halide test — add dilute nitric acid first, then silver nitrate solution: Cl⁻ → white precipitate (AgCl). Br⁻ → cream precipitate (AgBr). I⁻ → yellow precipitate (AgI). Sulfate test — add dilute hydrochloric acid first, then barium chloride solution: SO₄²⁻ → white precipitate (BaSO₄). Carbonate test — add dilute hydrochloric acid: CO₃²⁻ → bubbles of CO₂ gas → test: turns limewater milky.' from public.chem_skills where skill_ref = 'T3-12';
insert into public.chem_content (skill_id, type, content) select id, 'mnemonic', 'Halide precipitate colours in order Cl, Br, I: White, Cream, Yellow — alphabetical elements, progressively darker precipitates.' from public.chem_skills where skill_ref = 'T3-12';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Forgetting to acidify with dilute acid before adding silver nitrate or barium chloride. Acidification removes carbonate and sulfite ions that would otherwise give false positive precipitates.' from public.chem_skills where skill_ref = 'T3-12';

-- ══════════════════════════════════════════════════════════════
-- TOPIC 4: Acids and Alkalis
-- ══════════════════════════════════════════════════════════════

-- T4-01: H+ and OH- ions
insert into public.chem_content (skill_id, type, content) select id, 'definition', 'Acids produce hydrogen ions (H⁺) when dissolved in water (aqueous solution). Alkalis produce hydroxide ions (OH⁻) when dissolved in water.' from public.chem_skills where skill_ref = 'T4-01';
insert into public.chem_content (skill_id, type, content) select id, 'equation', 'HCl(aq) → H⁺(aq) + Cl⁻(aq). H₂SO₄(aq) → 2H⁺(aq) + SO₄²⁻(aq). NaOH(aq) → Na⁺(aq) + OH⁻(aq).' from public.chem_skills where skill_ref = 'T4-01';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Saying "acid contains H" or "alkali contains OH" without specifying these are ions in aqueous solution. Acids and alkalis are defined by the ions they produce when dissolved in water.' from public.chem_skills where skill_ref = 'T4-01';

-- T4-02: Proton donor / acceptor
insert into public.chem_content (skill_id, type, content) select id, 'definition', 'Brønsted-Lowry definition: an acid is a proton donor — it donates H⁺ ions. A base is a proton acceptor — it accepts H⁺ ions. In this context, "proton" means a hydrogen ion (H⁺), not a nuclear proton.' from public.chem_skills where skill_ref = 'T4-02';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'HCl + H₂O → H₃O⁺ + Cl⁻. HCl donates H⁺ to water — HCl is acting as an acid (proton donor). Water accepts H⁺ — water is acting as a base (proton acceptor) in this reaction.' from public.chem_skills where skill_ref = 'T4-02';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Confusing "proton" in this definition with a nuclear proton or subatomic particle. In acid-base chemistry, a proton means a hydrogen ion (H⁺) — a hydrogen atom that has lost its electron.' from public.chem_skills where skill_ref = 'T4-02';

-- T4-03: Indicators
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Litmus: turns red in acid, purple in neutral, blue in alkali. Phenolphthalein: colourless in acid and neutral, pink/magenta in alkali. Methyl orange: red in acid, orange in neutral, yellow in alkali.' from public.chem_skills where skill_ref = 'T4-03';
insert into public.chem_content (skill_id, type, content) select id, 'mnemonic', 'Phenolphthalein: Pink in alkali — both start with a P sound. Methyl orange: In Acid it is reddish (like a warning). Litmus: Blue for Base (both start with B).' from public.chem_skills where skill_ref = 'T4-03';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Saying litmus turns green in neutral solution. Litmus turns PURPLE in neutral. Green at pH 7 is the colour of universal indicator — not litmus.' from public.chem_skills where skill_ref = 'T4-03';

-- T4-04: pH scale
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'pH 0–3: strongly acidic (very high concentration of H⁺ ions). pH 4–6: weakly acidic. pH 7: neutral (H⁺ concentration equals OH⁻ concentration). pH 8–10: weakly alkaline. pH 11–14: strongly alkaline (very high concentration of OH⁻ ions). Each unit change in pH represents a tenfold change in H⁺ concentration.' from public.chem_skills where skill_ref = 'T4-04';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Thinking pH 0 is neutral or that low pH means less acidic. pH 0 is the most strongly acidic. pH 7 is neutral. As pH decreases below 7, acidity increases; as pH increases above 7, alkalinity increases.' from public.chem_skills where skill_ref = 'T4-04';

-- T4-05: Universal indicator
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Universal indicator is a mixture of several indicators that produces a continuous range of colours across the pH scale. Approximate colours: pH 1–3 red, pH 4–6 orange/yellow, pH 7 green, pH 8–10 blue, pH 11–14 violet/purple. It gives an approximate pH — not as precise as a pH meter.' from public.chem_skills where skill_ref = 'T4-05';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Confusing universal indicator with a single indicator like litmus. Universal indicator shows a range of colours; litmus only distinguishes acid from alkali with two colours.' from public.chem_skills where skill_ref = 'T4-05';

-- T4-06: Diagrams and models for strength/concentration
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Strong acid: fully ionises in water → diagram shows many H⁺ ions and few intact acid molecules. Weak acid: partially ionises → diagram shows few H⁺ ions and many intact acid molecules. Concentrated: many solute particles per unit volume. Dilute: few solute particles per unit volume. KEY: strong does NOT mean concentrated. A strong acid can be dilute; a weak acid can be concentrated.' from public.chem_skills where skill_ref = 'T4-06';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Using "strong" and "concentrated" interchangeably. Strong/weak refers to degree of ionisation. Concentrated/dilute refers to amount of substance dissolved per unit volume. These are completely separate properties.' from public.chem_skills where skill_ref = 'T4-06';

-- T4-07: Bases and alkalis
insert into public.chem_content (skill_id, type, content) select id, 'definition', 'A base is any substance that can neutralise an acid. An alkali is a base that dissolves in water to produce hydroxide ions (OH⁻). Metal oxides (e.g. CuO, MgO), metal hydroxides (e.g. NaOH, Ca(OH)₂) and ammonia (NH₃) are all bases. Only those that dissolve in water are alkalis.' from public.chem_skills where skill_ref = 'T4-07';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'NaOH is both a base AND an alkali (dissolves in water). CuO is a base but NOT an alkali (insoluble in water). NH₃ dissolved in water acts as an alkali, producing OH⁻ ions.' from public.chem_skills where skill_ref = 'T4-07';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Saying all bases are alkalis. Alkalis are a subset of bases — only those that dissolve in water to form OH⁻ ions. All alkalis are bases, but not all bases are alkalis.' from public.chem_skills where skill_ref = 'T4-07';

-- T4-08: Neutralisation
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Neutralisation: acid + base → salt + water. The H⁺ ions from the acid react with the OH⁻ ions from the alkali. The salt formed depends on which acid and which base are used. HCl forms chloride salts; H₂SO₄ forms sulfate salts; HNO₃ forms nitrate salts.' from public.chem_skills where skill_ref = 'T4-08';
insert into public.chem_content (skill_id, type, content) select id, 'equation', 'Ionic equation for neutralisation: H⁺(aq) + OH⁻(aq) → H₂O(l). Full equation example: HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l).' from public.chem_skills where skill_ref = 'T4-08';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Forgetting that water is produced as well as the salt. The products of a neutralisation reaction are always a salt AND water (when a hydroxide or oxide is the base). Also: forgetting to name the salt correctly using the metal and the acid anion.' from public.chem_skills where skill_ref = 'T4-08';

-- T4-09: Reactions of acids with bases and carbonates
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Acid + metal oxide → salt + water. Acid + metal hydroxide → salt + water. Acid + metal carbonate → salt + water + carbon dioxide. HCl forms chloride salts. H₂SO₄ forms sulfate salts. HNO₃ forms nitrate salts.' from public.chem_skills where skill_ref = 'T4-09';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'H₂SO₄(aq) + CuO(s) → CuSO₄(aq) + H₂O(l). 2HCl(aq) + CaCO₃(s) → CaCl₂(aq) + H₂O(l) + CO₂(g). HNO₃(aq) + NaOH(aq) → NaNO₃(aq) + H₂O(l).' from public.chem_skills where skill_ref = 'T4-09';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Forgetting that CO₂ is produced when acid reacts with a carbonate. Always: acid + carbonate → salt + water + carbon dioxide. Also: not balancing — note 2HCl are needed for CaCO₃ to give CaCl₂.' from public.chem_skills where skill_ref = 'T4-09';

-- ══════════════════════════════════════════════════════════════
-- TOPIC 5: Metals
-- ══════════════════════════════════════════════════════════════

-- T5-01: Classify by conductivity and oxide character
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Metals: conduct electricity (free electrons), form basic oxides (react with acids to form salt + water). Non-metals: generally do not conduct electricity, form acidic oxides (dissolve in water to form acids) or neutral oxides. Exception: graphite (carbon) conducts electricity despite being a non-metal.' from public.chem_skills where skill_ref = 'T5-01';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Saying all non-metals do not conduct electricity. Graphite is a non-metal that conducts electricity due to its delocalised electrons in layered structure. This is a common exception that examiners test.' from public.chem_skills where skill_ref = 'T5-01';

-- T5-02: Identify metal from Periodic Table
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Metals occupy the left side and centre of the Periodic Table: Groups 1, 2, and all transition metals (the d-block). Non-metals are in the top right. The diagonal boundary separates them. Hydrogen (Group 1) is a non-metal exception.' from public.chem_skills where skill_ref = 'T5-02';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Classifying hydrogen as a metal because it is in Group 1. Hydrogen is a non-metal gas at room temperature and does not display metallic properties.' from public.chem_skills where skill_ref = 'T5-02';

-- T5-03: Reactivity series
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'The reactivity series orders metals from most reactive (top) to least reactive (bottom) based on how vigorously they react with water and acids. Most reactive: Potassium (K) > Sodium (Na) > Lithium (Li) > Calcium (Ca) > Magnesium (Mg) > Aluminium (Al) > Zinc (Zn) > Iron (Fe) > Tin (Sn) > Lead (Pb) > Copper (Cu) > Silver (Ag) > Gold (Au): least reactive.' from public.chem_skills where skill_ref = 'T5-03';
insert into public.chem_content (skill_id, type, content) select id, 'mnemonic', 'King Solomon Loves Candy More At Zoo For Shooting Popcorn Carelessly At Girls: K, Na, Li, Ca, Mg, Al, Zn, Fe, Sn, Pb, Cu, Ag, Au.' from public.chem_skills where skill_ref = 'T5-03';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Placing lithium above sodium in the series. The correct order is K > Na > Li — potassium is most reactive, then sodium, then lithium. Students often reverse Na and Li.' from public.chem_skills where skill_ref = 'T5-03';

-- T5-04: Equations for metals with water and acids
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', '2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g). Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g). Zn(s) + H₂SO₄(aq) → ZnSO₄(aq) + H₂(g). Fe(s) + 2HCl(aq) → FeCl₂(aq) + H₂(g).' from public.chem_skills where skill_ref = 'T5-04';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Forgetting that hydrogen gas (H₂) is always produced when a metal reacts with water or an acid. Also: not balancing the equation — Na needs coefficient 2 to balance with 2NaOH and H₂.' from public.chem_skills where skill_ref = 'T5-04';

-- T5-05: Observations when metals react with acids
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Observable changes: bubbling/fizzing (hydrogen gas is produced), the metal gradually dissolves/disappears, the temperature of the solution increases (exothermic reaction). More reactive metals react faster and more vigorously. For transition metals: the solution may become coloured as a metal salt forms (e.g. iron → pale green FeCl₂ solution).' from public.chem_skills where skill_ref = 'T5-05';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Saying the solution changes colour for all reactions. Colour change in solution only occurs with transition metal salts. For Group 1 and 2 metals, the salt solution is colourless.' from public.chem_skills where skill_ref = 'T5-05';

-- T5-06: Group 1 with air and water — reactivity trend
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'Reactivity increases down Group 1: Li < Na < K. All react with water to produce metal hydroxide + hydrogen gas. Reactivity trend evidence: lithium fizzes slowly; sodium melts into a ball and fizzes rapidly; potassium ignites with a lilac flame and reacts very vigorously.' from public.chem_skills where skill_ref = 'T5-06';
insert into public.chem_content (skill_id, type, content) select id, 'equation', '2Li(s) + 2H₂O(l) → 2LiOH(aq) + H₂(g). 2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g). 2K(s) + 2H₂O(l) → 2KOH(aq) + H₂(g). All three equations have the same structure — only the metal symbol changes.' from public.chem_skills where skill_ref = 'T5-06';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Saying all Group 1 metals react with the same vigour. The vigour increases significantly: Li is relatively calm, Na is rapid, K is very violent with a coloured flame. The trend is due to increasing atomic radius and decreased nuclear attraction on the outer electron.' from public.chem_skills where skill_ref = 'T5-06';

-- T5-07: Displacement reactions
insert into public.chem_content (skill_id, type, content) select id, 'concept', 'A more reactive metal displaces a less reactive metal from a solution of its salt. The more reactive metal loses electrons to the metal ions in solution, causing the less reactive metal to deposit as a solid. This only works one way — a less reactive metal cannot displace a more reactive one.' from public.chem_skills where skill_ref = 'T5-07';
insert into public.chem_content (skill_id, type, content) select id, 'worked_example', 'Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s). Iron displaces copper because iron is more reactive. Observations: blue CuSO₄ solution fades to pale green (FeSO₄), orange/red solid (copper metal) deposits on the iron. Ionic equation: Fe(s) + Cu²⁺(aq) → Fe²⁺(aq) + Cu(s).' from public.chem_skills where skill_ref = 'T5-07';
insert into public.chem_content (skill_id, type, content) select id, 'common_error', 'Thinking displacement works in both directions. A less reactive metal CANNOT displace a more reactive one. Cu cannot displace Fe from iron sulfate — copper is less reactive than iron, so no reaction occurs.' from public.chem_skills where skill_ref = 'T5-07';
