export type DomainGroup =
  | "life"
  | "physical"
  | "math-cs"
  | "engineering"
  | "social"
  | "humanities"
  | "other";

export type Domain = {
  id: string;
  label: string;
  group: DomainGroup;
  defaultAgents: string[];
  defaultTemplates: string[];
  keywords: string[];
};

export const DOMAIN_GROUPS: { id: DomainGroup; label: string; description: string }[] = [
  {
    id: "life",
    label: "Life sciences",
    description: "Biology, medicine, ecology, and the systems that read or manipulate living matter.",
  },
  {
    id: "physical",
    label: "Physical sciences",
    description: "Physics, chemistry, materials, and the structure of the natural world.",
  },
  {
    id: "math-cs",
    label: "Mathematics, computer science & statistics",
    description: "Formal systems, computation, learning, and the analysis of data.",
  },
  {
    id: "engineering",
    label: "Engineering",
    description: "Applied design and the construction of physical or digital systems.",
  },
  {
    id: "social",
    label: "Social & behavioural sciences",
    description: "Human behaviour, institutions, and the methods used to study them.",
  },
  {
    id: "humanities",
    label: "History & philosophy of science",
    description: "Studies of how knowledge is made, justified, and revised.",
  },
  {
    id: "other",
    label: "Other / interdisciplinary",
    description: "Fields that cross boundaries or sit outside the standard taxonomy.",
  },
];

export const DOMAINS: Domain[] = [
  // Life sciences
  { id: "molecular-biology", label: "Molecular biology", group: "life", defaultAgents: ["literature", "analyst", "auditor"], defaultTemplates: ["lab-study"], keywords: ["protein", "DNA", "transcription"] },
  { id: "cell-biology", label: "Cell biology", group: "life", defaultAgents: ["literature", "analyst", "auditor"], defaultTemplates: ["lab-study"], keywords: ["organelle", "signaling"] },
  { id: "genetics", label: "Genetics & genomics", group: "life", defaultAgents: ["literature", "analyst"], defaultTemplates: ["sequencing-study"], keywords: ["genome", "GWAS", "variant"] },
  { id: "microbiology", label: "Microbiology & virology", group: "life", defaultAgents: ["literature", "analyst", "auditor"], defaultTemplates: ["lab-study"], keywords: ["bacteria", "virus", "phage"] },
  { id: "immunology", label: "Immunology", group: "life", defaultAgents: ["literature", "analyst"], defaultTemplates: ["lab-study"], keywords: ["antibody", "T-cell", "cytokine"] },
  { id: "neuroscience", label: "Neuroscience", group: "life", defaultAgents: ["literature", "analyst"], defaultTemplates: ["imaging-study"], keywords: ["neuron", "fMRI", "circuit"] },
  { id: "structural-biology", label: "Structural biology", group: "life", defaultAgents: ["literature", "analyst"], defaultTemplates: ["computational-study"], keywords: ["cryo-EM", "X-ray", "structure"] },
  { id: "systems-biology", label: "Systems & synthetic biology", group: "life", defaultAgents: ["literature", "analyst"], defaultTemplates: ["computational-study"], keywords: ["pathway", "circuit", "design"] },
  { id: "pharmacology", label: "Pharmacology", group: "life", defaultAgents: ["literature", "analyst", "auditor"], defaultTemplates: ["lab-study"], keywords: ["drug", "ADMET", "target"] },
  { id: "medicine", label: "Medicine (clinical & translational)", group: "life", defaultAgents: ["literature", "analyst", "auditor"], defaultTemplates: ["clinical-study"], keywords: ["trial", "patient", "biomarker"] },
  { id: "epidemiology", label: "Epidemiology & public health", group: "life", defaultAgents: ["literature", "analyst"], defaultTemplates: ["cohort-study"], keywords: ["cohort", "exposure", "outcome"] },
  { id: "ecology", label: "Ecology & evolution", group: "life", defaultAgents: ["literature", "analyst"], defaultTemplates: ["field-study"], keywords: ["species", "population", "selection"] },
  { id: "bioinformatics", label: "Bioinformatics", group: "life", defaultAgents: ["literature", "analyst"], defaultTemplates: ["computational-study"], keywords: ["sequence", "pipeline", "annotation"] },

  // Physical sciences
  { id: "physics-cm", label: "Condensed matter physics", group: "physical", defaultAgents: ["literature", "analyst"], defaultTemplates: ["computational-study"], keywords: ["lattice", "phase", "transport"] },
  { id: "physics-hep", label: "High-energy / particle physics", group: "physical", defaultAgents: ["literature", "analyst"], defaultTemplates: ["data-analysis"], keywords: ["collider", "QCD", "detector"] },
  { id: "physics-amo", label: "Atomic, molecular & optical physics", group: "physical", defaultAgents: ["literature", "analyst"], defaultTemplates: ["lab-study"], keywords: ["laser", "quantum", "atom"] },
  { id: "astronomy", label: "Astronomy & astrophysics", group: "physical", defaultAgents: ["literature", "analyst"], defaultTemplates: ["observational-study"], keywords: ["telescope", "galaxy", "spectrum"] },
  { id: "cosmology", label: "Cosmology", group: "physical", defaultAgents: ["literature", "analyst"], defaultTemplates: ["computational-study"], keywords: ["CMB", "inflation", "dark"] },
  { id: "earth-planetary", label: "Earth & planetary science", group: "physical", defaultAgents: ["literature", "analyst"], defaultTemplates: ["field-study"], keywords: ["geology", "atmosphere", "ocean"] },
  { id: "climate", label: "Climate & atmospheric science", group: "physical", defaultAgents: ["literature", "analyst"], defaultTemplates: ["computational-study"], keywords: ["model", "attribution", "forcing"] },
  { id: "chemistry-organic", label: "Organic chemistry", group: "physical", defaultAgents: ["literature", "analyst", "auditor"], defaultTemplates: ["synthesis-study"], keywords: ["reaction", "synthesis", "mechanism"] },
  { id: "chemistry-inorganic", label: "Inorganic & physical chemistry", group: "physical", defaultAgents: ["literature", "analyst"], defaultTemplates: ["lab-study"], keywords: ["catalyst", "kinetics", "spectra"] },
  { id: "materials", label: "Materials science", group: "physical", defaultAgents: ["literature", "analyst"], defaultTemplates: ["materials-study"], keywords: ["alloy", "DFT", "fabrication"] },

  // Math, CS, statistics
  { id: "pure-math", label: "Pure mathematics", group: "math-cs", defaultAgents: ["literature", "auditor"], defaultTemplates: ["proof-study"], keywords: ["theorem", "proof", "structure"] },
  { id: "applied-math", label: "Applied mathematics", group: "math-cs", defaultAgents: ["literature", "analyst"], defaultTemplates: ["computational-study"], keywords: ["PDE", "optimisation", "numerical"] },
  { id: "statistics", label: "Statistics & probability", group: "math-cs", defaultAgents: ["literature", "analyst", "auditor"], defaultTemplates: ["data-analysis"], keywords: ["inference", "Bayesian", "estimator"] },
  { id: "theoretical-cs", label: "Theoretical computer science", group: "math-cs", defaultAgents: ["literature", "auditor"], defaultTemplates: ["proof-study"], keywords: ["complexity", "algorithm", "lower bound"] },
  { id: "ml-ai", label: "Machine learning & AI", group: "math-cs", defaultAgents: ["literature", "analyst"], defaultTemplates: ["empirical-ml"], keywords: ["model", "benchmark", "training"] },
  { id: "nlp", label: "Natural language processing", group: "math-cs", defaultAgents: ["literature", "analyst"], defaultTemplates: ["empirical-ml"], keywords: ["LLM", "corpus", "evaluation"] },
  { id: "vision", label: "Computer vision", group: "math-cs", defaultAgents: ["literature", "analyst"], defaultTemplates: ["empirical-ml"], keywords: ["detection", "segmentation", "dataset"] },
  { id: "robotics", label: "Robotics", group: "math-cs", defaultAgents: ["literature", "analyst"], defaultTemplates: ["lab-study"], keywords: ["control", "perception", "policy"] },
  { id: "hci", label: "Human–computer interaction", group: "math-cs", defaultAgents: ["literature", "analyst"], defaultTemplates: ["user-study"], keywords: ["usability", "ethnography", "study"] },
  { id: "systems", label: "Systems & networking", group: "math-cs", defaultAgents: ["literature", "analyst"], defaultTemplates: ["empirical-systems"], keywords: ["latency", "throughput", "kernel"] },
  { id: "security", label: "Security & cryptography", group: "math-cs", defaultAgents: ["literature", "auditor"], defaultTemplates: ["empirical-systems"], keywords: ["threat", "protocol", "primitive"] },
  { id: "quantum-computing", label: "Quantum information & computing", group: "math-cs", defaultAgents: ["literature", "analyst"], defaultTemplates: ["computational-study"], keywords: ["qubit", "circuit", "noise"] },

  // Engineering
  { id: "bioengineering", label: "Bioengineering", group: "engineering", defaultAgents: ["literature", "analyst", "auditor"], defaultTemplates: ["lab-study"], keywords: ["device", "tissue", "scaffold"] },
  { id: "chemical-eng", label: "Chemical engineering", group: "engineering", defaultAgents: ["literature", "analyst"], defaultTemplates: ["process-study"], keywords: ["reactor", "separation", "process"] },
  { id: "mechanical-eng", label: "Mechanical engineering", group: "engineering", defaultAgents: ["literature", "analyst"], defaultTemplates: ["lab-study"], keywords: ["solid", "fluid", "design"] },
  { id: "electrical-eng", label: "Electrical & electronics engineering", group: "engineering", defaultAgents: ["literature", "analyst"], defaultTemplates: ["lab-study"], keywords: ["circuit", "signal", "control"] },
  { id: "civil-eng", label: "Civil & environmental engineering", group: "engineering", defaultAgents: ["literature", "analyst"], defaultTemplates: ["field-study"], keywords: ["structure", "infrastructure", "geotech"] },
  { id: "aerospace-eng", label: "Aerospace engineering", group: "engineering", defaultAgents: ["literature", "analyst"], defaultTemplates: ["computational-study"], keywords: ["aerodynamics", "propulsion", "trajectory"] },
  { id: "nuclear-eng", label: "Nuclear engineering", group: "engineering", defaultAgents: ["literature", "analyst", "auditor"], defaultTemplates: ["computational-study"], keywords: ["reactor", "neutronics", "safety"] },

  // Social & behavioural
  { id: "psychology", label: "Psychology", group: "social", defaultAgents: ["literature", "analyst", "auditor"], defaultTemplates: ["user-study"], keywords: ["cognition", "experiment", "measure"] },
  { id: "cognitive-science", label: "Cognitive science", group: "social", defaultAgents: ["literature", "analyst"], defaultTemplates: ["user-study"], keywords: ["mind", "model", "task"] },
  { id: "sociology", label: "Sociology", group: "social", defaultAgents: ["literature", "analyst"], defaultTemplates: ["mixed-methods"], keywords: ["society", "survey", "ethnography"] },
  { id: "economics", label: "Economics", group: "social", defaultAgents: ["literature", "analyst", "auditor"], defaultTemplates: ["empirical-economics"], keywords: ["panel", "instrument", "identification"] },
  { id: "political-science", label: "Political science", group: "social", defaultAgents: ["literature", "analyst"], defaultTemplates: ["mixed-methods"], keywords: ["institution", "behaviour", "policy"] },
  { id: "anthropology", label: "Anthropology", group: "social", defaultAgents: ["literature", "analyst"], defaultTemplates: ["field-study"], keywords: ["culture", "fieldwork", "interview"] },
  { id: "linguistics", label: "Linguistics", group: "social", defaultAgents: ["literature", "analyst"], defaultTemplates: ["empirical-study"], keywords: ["syntax", "phonology", "corpus"] },
  { id: "education", label: "Education research", group: "social", defaultAgents: ["literature", "analyst"], defaultTemplates: ["user-study"], keywords: ["learning", "assessment", "curriculum"] },
  { id: "geography", label: "Geography", group: "social", defaultAgents: ["literature", "analyst"], defaultTemplates: ["field-study"], keywords: ["spatial", "GIS", "place"] },

  // Humanities-adjacent
  { id: "history-of-science", label: "History of science", group: "humanities", defaultAgents: ["literature"], defaultTemplates: ["archival-study"], keywords: ["archive", "manuscript", "period"] },
  { id: "philosophy-of-science", label: "Philosophy of science", group: "humanities", defaultAgents: ["literature", "auditor"], defaultTemplates: ["argument-study"], keywords: ["epistemology", "method", "argument"] },
  { id: "science-studies", label: "Science studies / STS", group: "humanities", defaultAgents: ["literature", "analyst"], defaultTemplates: ["mixed-methods"], keywords: ["practice", "infrastructure", "policy"] },

  // Other
  { id: "interdisciplinary", label: "Interdisciplinary / other", group: "other", defaultAgents: ["literature", "analyst"], defaultTemplates: ["lab-study"], keywords: ["custom", "cross-domain"] },
];

export const DOMAINS_BY_GROUP: Record<DomainGroup, Domain[]> = DOMAIN_GROUPS.reduce(
  (acc, g) => {
    acc[g.id] = DOMAINS.filter((d) => d.group === g.id);
    return acc;
  },
  {} as Record<DomainGroup, Domain[]>
);

export function findDomain(id: string): Domain | undefined {
  return DOMAINS.find((d) => d.id === id);
}

export const METHODS: { id: string; label: string; description: string }[] = [
  { id: "computational", label: "Computational", description: "Simulation, modelling, numerical methods, in-silico work." },
  { id: "experimental", label: "Experimental", description: "Controlled manipulation in lab or in-the-loop settings." },
  { id: "observational", label: "Observational", description: "Recorded measurements without intervention." },
  { id: "theoretical", label: "Theoretical", description: "Derivation, proof, or formal modelling." },
  { id: "wet-lab", label: "Wet lab", description: "Bench work involving biological or chemical material." },
  { id: "clinical", label: "Clinical", description: "Studies involving patients or human subjects under protocol." },
  { id: "fieldwork", label: "Fieldwork", description: "Data gathered outside the lab - sites, populations, environments." },
  { id: "qualitative", label: "Qualitative", description: "Interviews, ethnography, archival, discourse analysis." },
  { id: "review", label: "Review / synthesis", description: "Systematic review, meta-analysis, or theoretical synthesis." },
  { id: "engineering", label: "Engineering / build", description: "Designing and constructing artifacts, hardware, or systems." },
];

export const CAREER_STAGES: { id: string; label: string }[] = [
  { id: "undergrad", label: "Undergraduate" },
  { id: "masters", label: "Master's" },
  { id: "phd", label: "PhD" },
  { id: "postdoc", label: "Postdoctoral" },
  { id: "researcher", label: "Researcher" },
  { id: "pi", label: "Principal investigator" },
  { id: "industry", label: "Industry scientist" },
  { id: "engineer", label: "Engineer" },
  { id: "independent", label: "Independent researcher" },
  { id: "educator", label: "Educator" },
  { id: "journalist", label: "Science journalist" },
  { id: "other", label: "Other" },
];
