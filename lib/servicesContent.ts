export interface ServicePageContent {
  slug: string;
  serviceId: number;          // links to data/services.json for icon + color
  icon: string;               // lucide-react icon name
  color: string;              // tailwind icon background/text classes
  title: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  overview: string[];
  offerings: { title: string; desc: string }[];
  process: { title: string; desc: string }[];
  whyUs: string[];
}

export const SERVICE_PAGES: ServicePageContent[] = [
  {
    slug: 'environmental-impact-assessment-bangladesh',
    serviceId: 1,
    icon: 'Leaf',
    color: 'bg-green-50 text-green-600',
    title: 'Environmental Impact Assessment (EIA)',
    heroSubtitle: 'DoE-compliant EIA, IEE & Environmental Management Plans for projects across Bangladesh',
    metaTitle: 'Environmental Impact Assessment (EIA) in Bangladesh | Green BD',
    metaDescription: 'Expert Environmental Impact Assessment (EIA), IEE, and Environmental Management Plan (EMP) services in Bangladesh — DoE-compliant studies for industrial, infrastructure, and development projects.',
    keywords: [
      'Environmental Impact Assessment Bangladesh', 'EIA Bangladesh', 'EIA consultant Dhaka',
      'Environmental Management Plan Bangladesh', 'DoE environmental clearance Bangladesh',
      'IEE Bangladesh', 'environmental clearance certificate', 'EIA report Bangladesh',
    ],
    overview: [
      'Green BD Environmental Solutions prepares Environmental Impact Assessment (EIA), Initial Environmental Examination (IEE), and Environmental Management Plan (EMP) reports in full compliance with the Department of Environment (DoE) Bangladesh requirements and international standards such as IFC and World Bank safeguard policies.',
      'Our multidisciplinary team supports infrastructure, industrial, energy, real estate, and agro-based projects through every stage of environmental clearance — from screening and scoping to baseline data collection, impact prediction, mitigation planning, and stakeholder consultation.',
      'We have delivered EIA and EMP studies across all categories of projects classified under the Environment Conservation Rules (ECR), helping clients secure environmental clearance certificates efficiently while minimising ecological and social risk.',
    ],
    offerings: [
      { title: 'Screening & Scoping', desc: 'Project categorisation under ECR and identification of key environmental and social issues to be addressed in the assessment.' },
      { title: 'Baseline Environmental Surveys', desc: 'Air, water, soil, noise, ecology, and socio-economic baseline data collection through field surveys and laboratory testing.' },
      { title: 'Impact Prediction & Assessment', desc: 'Quantitative and qualitative analysis of potential project impacts on physical, biological, and social environments.' },
      { title: 'Environmental Management Plans (EMP)', desc: 'Mitigation measures, monitoring programs, and institutional arrangements to manage impacts throughout the project lifecycle.' },
      { title: 'Stakeholder & Public Consultation', desc: 'Facilitating consultations with local communities, government agencies, and affected parties as required by DoE.' },
      { title: 'DoE Liaison & Clearance Support', desc: 'End-to-end support for submission, review, and approval of EIA/IEE reports with the Department of Environment.' },
    ],
    process: [
      { title: 'Initial Consultation', desc: 'We review your project details, location, and scale to determine the applicable ECR category and assessment requirements.' },
      { title: 'Field Investigation', desc: 'Our team conducts site visits and baseline surveys covering air, water, soil, noise, biodiversity, and community profiles.' },
      { title: 'Report Preparation', desc: 'We compile findings into a DoE-compliant EIA/IEE report with impact assessments and a detailed Environmental Management Plan.' },
      { title: 'Submission & Approval', desc: 'We support submission to the Department of Environment and respond to review comments until clearance is granted.' },
    ],
    whyUs: [
      'Proven track record of DoE-approved EIA and IEE reports across multiple sectors',
      'In-house GIS, remote sensing, and laboratory testing capabilities',
      'Experienced team familiar with ECR 1997 (and amendments) and IFC Performance Standards',
      'Transparent timelines and direct liaison with regulatory authorities',
    ],
  },
  {
    slug: 'gis-remote-sensing',
    serviceId: 2,
    icon: 'Map',
    color: 'bg-blue-50 text-blue-600',
    title: 'GIS & Remote Sensing',
    heroSubtitle: 'Satellite imagery analysis, spatial data management, and geospatial mapping for Bangladesh',
    metaTitle: 'GIS & Remote Sensing Services in Bangladesh | Green BD',
    metaDescription: 'Professional GIS mapping and remote sensing services in Bangladesh — satellite imagery analysis, land use/land cover mapping, spatial data management, and geospatial planning support.',
    keywords: [
      'GIS services Bangladesh', 'remote sensing Bangladesh', 'GIS mapping Dhaka',
      'satellite imagery analysis Bangladesh', 'land use land cover mapping Bangladesh',
      'spatial data management', 'geospatial consultancy Bangladesh', 'GIS and RS services',
    ],
    overview: [
      'Green BD Environmental Solutions provides advanced GIS and remote sensing services to support environmental monitoring, land-use planning, infrastructure design, and disaster management across Bangladesh.',
      'Using satellite imagery (Landsat, Sentinel, and high-resolution commercial sources) combined with field-verified GPS data, our geospatial team produces accurate maps, change-detection analyses, and spatial decision-support tools for government agencies, NGOs, and private developers.',
      'From flood extent mapping to land use/land cover classification and 3D terrain modelling, our GIS solutions translate complex spatial data into actionable insights for planning and policy.',
    ],
    offerings: [
      { title: 'Land Use / Land Cover Mapping', desc: 'Multi-temporal satellite image classification to track urbanisation, deforestation, and agricultural change.' },
      { title: 'Satellite Image Analysis', desc: 'Processing and interpretation of optical and radar (SAR) imagery for environmental and infrastructure applications.' },
      { title: 'Flood & Hazard Mapping', desc: 'GIS-based flood extent, inundation depth, and hazard zonation mapping for risk assessment and planning.' },
      { title: 'Spatial Database Development', desc: 'Design and maintenance of GIS databases and web-based mapping dashboards for ongoing project monitoring.' },
      { title: 'Topographic & DEM Analysis', desc: 'Digital Elevation Model generation, slope, drainage, and watershed analysis for engineering and planning studies.' },
      { title: 'GPS Field Surveys', desc: 'Ground-truthing and field data collection to validate remote sensing outputs and improve map accuracy.' },
    ],
    process: [
      { title: 'Scope & Data Acquisition', desc: 'We identify the required satellite imagery, base maps, and ancillary spatial data for your area of interest.' },
      { title: 'Image Processing & Classification', desc: 'Imagery is pre-processed, classified, and analysed using industry-standard GIS and remote sensing software.' },
      { title: 'Field Verification', desc: 'Ground-truthing surveys validate classification accuracy and capture local context not visible from satellite data.' },
      { title: 'Map & Report Delivery', desc: 'Final maps, spatial datasets, and analytical reports are delivered in formats suited to your workflow (GIS shapefiles, PDF, web maps).' },
    ],
    whyUs: [
      'Access to current and historical satellite imagery archives covering Bangladesh',
      'Skilled analysts experienced in QGIS, ArcGIS, Google Earth Engine, and ENVI',
      'Field verification teams based across multiple districts',
      'Outputs tailored for both technical (GIS layers) and non-technical (visual maps, dashboards) audiences',
    ],
  },
  {
    slug: 'climate-change-research',
    serviceId: 3,
    icon: 'Cloud',
    color: 'bg-sky-50 text-sky-600',
    title: 'Climate Change Research',
    heroSubtitle: 'IPCC-aligned scenario modelling, vulnerability assessment, and adaptation planning',
    metaTitle: 'Climate Change Research & Adaptation Consultancy in Bangladesh | Green BD',
    metaDescription: 'Climate change research and adaptation consultancy in Bangladesh — IPCC-aligned scenario modelling, climate vulnerability assessments, and resilience planning for communities and infrastructure.',
    keywords: [
      'climate change research Bangladesh', 'climate vulnerability assessment Bangladesh',
      'climate change adaptation Bangladesh', 'IPCC scenario modeling Bangladesh',
      'climate resilience planning', 'sea level rise Bangladesh', 'climate risk assessment Dhaka',
    ],
    overview: [
      'Green BD Environmental Solutions conducts applied climate change research grounded in IPCC AR6 methodologies, helping government agencies, development partners, and private organisations understand and respond to climate risks across Bangladesh.',
      'Our work spans climate scenario modelling, sectoral vulnerability assessments (agriculture, water resources, coastal livelihoods, urban infrastructure), and the design of adaptation strategies tailored to local contexts.',
      'We combine downscaled climate projections with socio-economic data and field research to produce evidence-based recommendations that inform policy, project design, and community-level adaptation programs.',
    ],
    offerings: [
      { title: 'Climate Scenario Modelling', desc: 'Downscaling of global climate models (CMIP6/IPCC AR6) to project temperature, rainfall, and sea-level trends for specific regions.' },
      { title: 'Vulnerability & Risk Assessment', desc: 'Sector-specific assessments identifying exposure, sensitivity, and adaptive capacity of communities, ecosystems, and infrastructure.' },
      { title: 'Adaptation Planning', desc: 'Development of climate adaptation strategies and action plans aligned with national policies (NAP, NDC, BCCSAP).' },
      { title: 'Sea-Level Rise & Coastal Studies', desc: 'Analysis of sea-level rise impacts on coastal livelihoods, salinity intrusion, and erosion in southern Bangladesh.' },
      { title: 'Climate-Smart Agriculture Studies', desc: 'Research on climate-resilient cropping patterns and agricultural adaptation options for vulnerable regions.' },
      { title: 'Policy & Technical Reports', desc: 'Peer-reviewable research outputs and technical briefs to support funding proposals and policy advocacy.' },
    ],
    process: [
      { title: 'Research Design', desc: 'We define research questions, study area, and methodology aligned with IPCC and national climate frameworks.' },
      { title: 'Data Collection & Modelling', desc: 'Climate, environmental, and socio-economic data are gathered and analysed using established modelling tools.' },
      { title: 'Vulnerability Analysis', desc: 'We assess exposure and adaptive capacity to identify priority risks and adaptation entry points.' },
      { title: 'Reporting & Recommendations', desc: 'Findings are compiled into actionable reports with adaptation recommendations for stakeholders and decision-makers.' },
    ],
    whyUs: [
      'Research grounded in IPCC AR6-aligned methodologies',
      'Published work on sea-level rise, urban heat islands, and coastal livelihoods',
      'Strong field presence across coastal, hilly, and urban regions of Bangladesh',
      'Experience supporting NAP, NDC, and donor-funded climate programs',
    ],
  },
  {
    slug: 'disaster-risk-reduction',
    serviceId: 4,
    icon: 'Shield',
    color: 'bg-red-50 text-red-600',
    title: 'Disaster Risk Reduction',
    heroSubtitle: 'Multi-hazard risk profiling, early warning systems, and community-based DRR strategies',
    metaTitle: 'Disaster Risk Reduction (DRR) Consultancy in Bangladesh | Green BD',
    metaDescription: 'Disaster risk reduction consultancy in Bangladesh — multi-hazard risk mapping, flood and cyclone vulnerability assessment, early warning system design, and community-based DRR planning.',
    keywords: [
      'disaster risk reduction Bangladesh', 'DRR consultancy Bangladesh', 'flood risk assessment Bangladesh',
      'cyclone risk mapping', 'early warning systems Bangladesh', 'multi-hazard risk assessment',
      'community-based disaster management', 'flood vulnerability mapping Bangladesh',
    ],
    overview: [
      'Green BD Environmental Solutions supports government agencies, NGOs, and development projects with disaster risk reduction (DRR) services tailored to Bangladesh’s flood, cyclone, and drought-prone regions.',
      'Our team combines GIS-based hazard mapping with community-based vulnerability assessments to identify priority risk areas and design practical early warning and preparedness systems.',
      'We have worked extensively in haor wetlands, coastal upazilas, and riverine districts, integrating participatory mapping with satellite-derived flood extent data to enable hyperlocal early warning and resilience planning.',
    ],
    offerings: [
      { title: 'Multi-Hazard Risk Mapping', desc: 'GIS-based mapping of flood, cyclone, drought, and landslide risk zones to inform planning and resource allocation.' },
      { title: 'Flood & Cyclone Vulnerability Assessment', desc: 'Assessment of exposure and vulnerability of communities, infrastructure, and livelihoods to recurring hazards.' },
      { title: 'Early Warning System Design', desc: 'Design of community-based early warning systems integrating satellite data, hydrological monitoring, and local communication networks.' },
      { title: 'Participatory Risk Mapping', desc: 'Community-led mapping exercises that combine local knowledge with technical hazard data for hyperlocal risk profiles.' },
      { title: 'DRR Strategy & Contingency Planning', desc: 'Development of disaster preparedness, response, and contingency plans for organisations and local government institutions.' },
      { title: 'Post-Disaster Needs Assessment', desc: 'Rapid assessment of damage and needs following floods, cyclones, or other disaster events.' },
    ],
    process: [
      { title: 'Hazard & Exposure Analysis', desc: 'We map historical hazard events and overlay them with population, infrastructure, and land-use data.' },
      { title: 'Community Consultation', desc: 'Participatory workshops capture local knowledge of hazards, coping mechanisms, and priority needs.' },
      { title: 'Risk Profiling', desc: 'Combining technical and community data, we develop multi-hazard risk profiles for the study area.' },
      { title: 'Action Plan Development', desc: 'We deliver DRR strategies, early warning protocols, and contingency plans ready for implementation.' },
    ],
    whyUs: [
      'Field experience in haor wetlands, coastal belts, and flood-prone river basins',
      'Integration of satellite data with community-based participatory mapping',
      'Strong working relationships with local government and community institutions',
      'Practical, implementation-ready DRR strategies rather than purely academic outputs',
    ],
  },
  {
    slug: 'environmental-monitoring',
    serviceId: 5,
    icon: 'BarChart3',
    color: 'bg-purple-50 text-purple-600',
    title: 'Environmental Monitoring',
    heroSubtitle: 'Real-time air, water, and soil quality monitoring with data dashboards',
    metaTitle: 'Environmental Monitoring Services in Bangladesh | Green BD',
    metaDescription: 'Environmental monitoring services in Bangladesh — air, water, soil, and noise quality monitoring with real-time data dashboards to support compliance and informed policy decisions.',
    keywords: [
      'environmental monitoring Bangladesh', 'air quality monitoring Bangladesh', 'water quality testing Bangladesh',
      'soil quality assessment Bangladesh', 'noise monitoring Bangladesh', 'ETP monitoring Bangladesh',
      'environmental compliance monitoring', 'air pollution monitoring Dhaka',
    ],
    overview: [
      'Green BD Environmental Solutions designs and operates environmental monitoring programs that provide accurate, real-time data on air, water, soil, and noise quality for industries, development projects, and regulatory compliance.',
      'Our monitoring networks combine field instrumentation, laboratory analysis, and data dashboards that allow project owners and regulators to track environmental performance against DoE standards and international benchmarks.',
      'Whether for a one-time compliance assessment or a continuous monitoring program required under an Environmental Management Plan, our team delivers reliable data and clear reporting.',
    ],
    offerings: [
      { title: 'Air Quality Monitoring', desc: 'Ambient and stack emission monitoring for particulate matter, gases, and pollutants against DoE and WHO standards.' },
      { title: 'Water Quality Testing', desc: 'Surface, ground, and effluent water quality testing including physico-chemical and biological parameters.' },
      { title: 'Soil Quality Assessment', desc: 'Soil sampling and laboratory analysis to assess contamination, fertility, and suitability for development.' },
      { title: 'Noise & Vibration Monitoring', desc: 'Measurement of ambient and occupational noise levels against ECR noise standards.' },
      { title: 'ETP / Effluent Monitoring', desc: 'Regular monitoring of treatment plant performance and effluent discharge quality for compliance reporting.' },
      { title: 'Monitoring Dashboards & Reporting', desc: 'Data dashboards and periodic compliance reports for management, regulators, and development partners.' },
    ],
    process: [
      { title: 'Monitoring Plan Design', desc: 'We define parameters, sampling locations, and frequency based on regulatory requirements and project needs.' },
      { title: 'Field Sampling & Measurement', desc: 'Trained field technicians collect samples and take in-situ measurements using calibrated instruments.' },
      { title: 'Laboratory Analysis', desc: 'Samples are analysed at accredited laboratories following standard testing protocols.' },
      { title: 'Reporting & Dashboards', desc: 'Results are compiled into compliance reports and, where required, presented through online dashboards for ongoing tracking.' },
    ],
    whyUs: [
      'Calibrated field instrumentation and partnerships with accredited laboratories',
      'Monitoring programs designed to meet ECR and DoE compliance requirements',
      'Experience supporting EMP-mandated monitoring for industrial and infrastructure projects',
      'Clear, decision-ready reporting for management and regulators',
    ],
  },
  {
    slug: 'sustainability-consulting-esg',
    serviceId: 9,
    icon: 'Recycle',
    color: 'bg-lime-50 text-lime-600',
    title: 'Sustainability Consulting & ESG',
    heroSubtitle: 'ESG strategy, sustainability reporting, and green certification support for Bangladeshi businesses',
    metaTitle: 'Sustainability & ESG Consulting in Bangladesh | Green BD',
    metaDescription: 'Sustainability and ESG consulting in Bangladesh — ESG strategy development, sustainability reporting, carbon footprint assessment, and green certification support for businesses and organisations.',
    keywords: [
      'sustainability consulting Bangladesh', 'ESG consulting Bangladesh', 'ESG reporting Bangladesh',
      'corporate sustainability Bangladesh', 'carbon footprint assessment Bangladesh',
      'green certification Bangladesh', 'sustainability strategy consultancy', 'environmental sustainability Dhaka',
    ],
    overview: [
      'Green BD Environmental Solutions helps businesses, financial institutions, and development organisations in Bangladesh integrate environmental, social, and governance (ESG) principles into their strategy and operations.',
      'Our sustainability consulting services range from ESG gap assessments and reporting frameworks to carbon footprint analysis and support for green building or environmental certification.',
      'As Bangladeshi industries face increasing pressure from international buyers, lenders, and regulators to demonstrate sustainable practices, we provide practical, locally grounded guidance to help organisations meet these expectations.',
    ],
    offerings: [
      { title: 'ESG Strategy & Gap Assessment', desc: 'Assessment of current ESG performance against international frameworks (GRI, SASB, IFC) with a roadmap for improvement.' },
      { title: 'Sustainability Reporting', desc: 'Preparation of sustainability and ESG reports aligned with global reporting standards for stakeholders and lenders.' },
      { title: 'Carbon Footprint Assessment', desc: 'Measurement of organisational greenhouse gas emissions (Scope 1, 2, and 3) and identification of reduction opportunities.' },
      { title: 'Green Certification Support', desc: 'Technical support for green building (LEED, EDGE) and environmental management system (ISO 14001) certification processes.' },
      { title: 'Supply Chain Sustainability', desc: 'Assessment and improvement of environmental and social practices across supplier networks for export-oriented industries.' },
      { title: 'Climate Risk Disclosure', desc: 'Support with climate-related financial disclosure (TCFD-aligned) for investors and development finance institutions.' },
    ],
    process: [
      { title: 'Baseline Assessment', desc: 'We review current policies, operations, and data to establish your organisation’s ESG baseline.' },
      { title: 'Strategy Development', desc: 'We identify priority ESG issues and develop a tailored strategy and implementation roadmap.' },
      { title: 'Data Collection & Analysis', desc: 'Environmental and social performance data is collected and analysed, including carbon footprint calculations where required.' },
      { title: 'Reporting & Certification Support', desc: 'We prepare ESG reports and provide ongoing support through certification or disclosure processes.' },
    ],
    whyUs: [
      'Combines environmental science expertise with practical ESG and reporting know-how',
      'Familiar with international frameworks (GRI, IFC Performance Standards, TCFD) and local regulatory context',
      'Experience supporting export-oriented industries facing buyer sustainability requirements',
      'Practical recommendations focused on measurable improvement, not just reporting',
    ],
  },
];

export function getServicePageBySlug(slug: string): ServicePageContent | undefined {
  return SERVICE_PAGES.find(s => s.slug === slug);
}
