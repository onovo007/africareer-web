// Region -> institution lists (mirrors the Streamlit pilot). "Other" lets users type any name.
export const SCHOOLS = {
  Africa: [
    "University of Cape Town", "University of the Witwatersrand", "Stellenbosch University",
    "University of Pretoria", "University of Ibadan", "University of Lagos",
    "University of Nigeria, Nsukka", "Ahmadu Bello University", "Covenant University",
    "University of Nairobi", "Makerere University", "University of Ghana",
    "Kwame Nkrumah University of Science and Technology", "Addis Ababa University",
    "Cairo University", "University of Rwanda", "Other (type below)",
  ],
  Europe: [
    "University of Navarra", "ETH Zurich", "University of Geneva", "Sorbonne University",
    "KU Leuven", "Karolinska Institute", "University of Amsterdam", "Delft University of Technology",
    "LMU Munich", "Heidelberg University", "Sciences Po", "Trinity College Dublin",
    "University of Copenhagen", "Uppsala University", "Other (type below)",
  ],
  "United Kingdom": [
    "University of Oxford", "University of Cambridge", "Imperial College London",
    "University College London (UCL)", "London School of Economics (LSE)",
    "University of Edinburgh", "University of Manchester", "King's College London",
    "University of Warwick", "University of Bristol", "Other (type below)",
  ],
  Canada: [
    "University of Toronto", "McGill University", "University of British Columbia",
    "University of Alberta", "McMaster University", "University of Waterloo",
    "Universite de Montreal", "Queen's University", "University of Ottawa", "Other (type below)",
  ],
  Asia: [
    "National University of Singapore", "Nanyang Technological University", "University of Tokyo",
    "Kyoto University", "Tsinghua University", "Peking University", "University of Hong Kong",
    "KAIST", "Seoul National University", "IIT Bombay", "IIT Delhi", "University of Malaya",
    "Other (type below)",
  ],
  "United States": [
    "Harvard University", "Massachusetts Institute of Technology (MIT)", "Stanford University",
    "Johns Hopkins University", "University of California, Berkeley", "Yale University",
    "Columbia University", "University of Michigan", "University of Washington", "Duke University",
    "University of Pennsylvania", "Emory University", "Other (type below)",
  ],
  Other: ["Other (type below)"],
};

export const REGIONS = Object.keys(SCHOOLS);
