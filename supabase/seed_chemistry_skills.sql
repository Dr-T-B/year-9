-- ============================================================
-- SEED: 43 Chemistry skills from Year 9 Forest School tracker
-- Topics 1–5 | Source: Year_9_Forest_Revision_Tracker.xlsx
-- ============================================================

insert into public.chem_skills
  (topic_num, topic_name, skill_ref, skill_text, question_type, diagram_req, ao_tag)
values

-- TOPIC 1: Physical Changes (7 skills)
(1,'Physical Changes','T1-01','Describe the three states of matter in terms of the arrangement, movement and energy of the particles','describe',false,'AO1'),
(1,'Physical Changes','T1-02','Name the interconversions between solids, liquids and gases (melting, freezing, boiling/evaporation, condensation, sublimation)','recall',false,'AO1'),
(1,'Physical Changes','T1-03','Explain how the interconversions between solids, liquids and gases are achieved in terms of energy changes','explain',false,'AO2'),
(1,'Physical Changes','T1-04','Describe the changes in arrangement, movement and energy of the particles at the interconversions between states of matter','describe',false,'AO2'),
(1,'Physical Changes','T1-05','Explain heating and cooling curves including the flat sections and what they represent','explain',false,'AO2'),
(1,'Physical Changes','T1-06','Explain diffusion in terms of particles and explain how temperature affects the rate of diffusion','explain',false,'AO2'),
(1,'Physical Changes','T1-07','Describe dilution in terms of particle arrangements','describe',false,'AO1'),

-- TOPIC 2: Atoms and Elements (8 skills)
(2,'Atoms and Elements','T2-01','State the position, relative mass and relative charge of protons, neutrons and electrons','recall',false,'AO1'),
(2,'Atoms and Elements','T2-02','Define mass number, atomic number and isotope','recall',false,'AO1'),
(2,'Atoms and Elements','T2-03','Classify a substance as an element','recall',false,'AO1'),
(2,'Atoms and Elements','T2-04','Write the electron configurations of the first 20 elements','recall',false,'AO1'),
(2,'Atoms and Elements','T2-05','Explain how atomic structure links to position in the Periodic Table — group equals electrons in outer shell; period equals number of shells','explain',false,'AO2'),
(2,'Atoms and Elements','T2-06','Describe the arrangement of elements in the Periodic Table into groups and periods and in order of atomic number','describe',false,'AO1'),
(2,'Atoms and Elements','T2-07','Identify metals and non-metals using the Periodic Table','recall',false,'AO1'),
(2,'Atoms and Elements','T2-08','Calculate relative atomic mass from isotopic abundance data','calculate',false,'AO2'),

-- TOPIC 3: Ions (12 skills)
(3,'Ions','T3-01','Classify a substance as a compound','recall',false,'AO1'),
(3,'Ions','T3-02','Write word equations for chemical reactions','recall',false,'AO1'),
(3,'Ions','T3-03','Explain how ions are formed by electron loss (cations) or electron gain (anions)','explain',false,'AO2'),
(3,'Ions','T3-04','Explain why elements in the same group of the Periodic Table have similar chemical properties','explain',false,'AO2'),
(3,'Ions','T3-05','Draw dot-and-cross diagrams to show the formation of ionic compounds by electron transfer limited to groups 1 2 3 and 5 6 7','diagram',true,'AO2'),
(3,'Ions','T3-06','State the charges of ions: metals in groups 1 2 3; non-metals in groups 5 6 7; silver copper(II) iron(II) iron(III) lead zinc; hydrogen hydroxide ammonium carbonate nitrate sulfate','recall',false,'AO1'),
(3,'Ions','T3-07','Write correct formulae for compounds formed between the listed ions','recall',false,'AO2'),
(3,'Ions','T3-08','Write balanced symbol equations for chemical reactions including state symbols','balance',false,'AO2'),
(3,'Ions','T3-09','Describe how to carry out a flame test including cleaning the wire dipping in sample and holding in flame','describe',false,'AO1'),
(3,'Ions','T3-10','State the flame test colours: lithium red; sodium yellow; potassium lilac; calcium orange-red; copper blue-green','recall',false,'AO1'),
(3,'Ions','T3-11','Describe the cation tests: ammonium using NaOH solution and testing gas evolved with damp litmus; copper(II) iron(II) and iron(III) using NaOH solution observing precipitate colours','describe',false,'AO1'),
(3,'Ions','T3-12','Describe the anion tests: chloride bromide iodide using acidified silver nitrate; sulfate using acidified barium chloride; carbonate using HCl and identifying gas evolved','describe',false,'AO1'),

-- TOPIC 4: Acids and Alkalis (9 skills)
(4,'Acids and Alkalis','T4-01','Explain that acids in aqueous solution are a source of hydrogen ions (H+) and alkalis in aqueous solution are a source of hydroxide ions (OH-)','recall',false,'AO1'),
(4,'Acids and Alkalis','T4-02','Define an acid as a proton donor and a base as a proton acceptor','recall',false,'AO1'),
(4,'Acids and Alkalis','T4-03','Describe the use of phenolphthalein litmus and methyl orange to distinguish between acidic and alkaline solutions including colour changes','recall',false,'AO1'),
(4,'Acids and Alkalis','T4-04','Explain how the pH scale (0-14) classifies solutions as strongly acidic (0-3) weakly acidic (4-6) neutral (7) weakly alkaline (8-10) or strongly alkaline (11-14)','recall',false,'AO1'),
(4,'Acids and Alkalis','T4-05','Describe the use of universal indicator to measure the approximate pH of an aqueous solution','describe',false,'AO1'),
(4,'Acids and Alkalis','T4-06','Describe the features of diagrams and models that indicate the strength or concentration of acidic and alkaline solutions','describe',false,'AO2'),
(4,'Acids and Alkalis','T4-07','State that metal oxides metal hydroxides and ammonia can act as bases and that alkalis are bases soluble in water','recall',false,'AO1'),
(4,'Acids and Alkalis','T4-08','Explain how alkalis neutralise acids to form a salt and water including the ionic equation H+ + OH- to give H2O','explain',false,'AO2'),
(4,'Acids and Alkalis','T4-09','Write word and balanced symbol equations for reactions of hydrochloric acid sulfuric acid and nitric acid with bases and metal carbonates to form named salts','balance',false,'AO2'),

-- TOPIC 5: Metals (7 skills)
(5,'Metals','T5-01','Use electrical conductivity and acid-base character of oxides to classify elements as metals or non-metals','explain',false,'AO2'),
(5,'Metals','T5-02','Identify a metal from its position in the Periodic Table','recall',false,'AO1'),
(5,'Metals','T5-03','Explain how metals are ordered into a reactivity series based on reactions with water dilute hydrochloric acid and dilute sulfuric acid','explain',false,'AO2'),
(5,'Metals','T5-04','Write word and balanced symbol equations for metals reacting with water and metals reacting with acids','balance',false,'AO2'),
(5,'Metals','T5-05','Describe the observations when metals react with acids such as bubbling metal dissolves and temperature rise','describe',false,'AO1'),
(5,'Metals','T5-06','Explain how reactions of group 1 metals with air and water provide evidence for the reactivity trend including word and symbol equations for lithium sodium and potassium','explain',false,'AO2'),
(5,'Metals','T5-07','Explain displacement reactions and write word and balanced symbol equations for them','explain',false,'AO2');
