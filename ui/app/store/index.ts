// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { createSlice, configureStore } from '@reduxjs/toolkit';

import { allAttacksStatsDataApi } from '../services/allAttacksStatsDataApi';
import { allAttacksMetricsDataApi } from '../services/allAttacksMetricsDataApi';
import { allAttacksReportDataApi } from '../services/allAttacksReportDataApi';
import { mitreAttackMatrixApi } from '../services/mitreAttackMatrixApi';
import { tacticTechniquesStatsApi } from '../../app/services/tacticTechniquesStatsApi';
import { observablesDataApi } from '../services/observablesDataApi';

import { User } from '../../src/types';
import { attackBamDataApi } from '../services/attackBamDataApi';

const initialState = {
  openDrawerLeft: false,
  openDrawerLeftWidth: 64,
  openDrawerRight: false,
  openDrawerRightWidth: 425,
  selectedReport: {},

  methodologyText: `The CyOTE methodology, as shown in Figure 1, applies fundamental concepts of perception and comprehension to a universe of knowns and unknowns increasingly disaggregated into observables, anomalies, and triggering events. The program utilizes MITRE’s ATT&CK® Framework for Industrial Control Systems (ICS) as a common lexicon to assess triggering events. By leveraging the CyOTE methodology with existing commercial monitoring capabilities and manual data collection, energy sector partners can understand relationships between multiple observables, which could represent a faint signal of an attack requiring investigation. CyOTE can assist organizations in prioritizing their OT environment visibility investments.

  Historical case studies such as this one support continued learning through analysis of incidents that have impacted OT. This precursor analysis report is based on ly available reports and provides examples of how key concepts in the CyOTE methodology appear in the real world, providing insights on how similar novel attacks could be detected earlier and therefore mitigated. The analysis enables OT personnel to independently identify observables associated with techniques known to be indicators of attack within OT environments. The identified observables highlight anomalous events for further investigation, which could enhance comprehension of malicious activity.

  A timeline of events based on the CyOTE methodology portrays the attack-related observables associated with the precursor analysis report cyber attack. The timeline includes assessed dates, the triggering event, and comprehension of malicious activity by the organization. The point on this timeline when each technique appears is critical to the organization’s ability to perceive and comprehend the associated malicious activity. Perception of techniques early in the timeline is critical, since halting those techniques will generally have greater potential to limit additional attack vectors using other techniques, defeat the cyber attack, and limit damage to operations.

  Each technique has an assessed perceivability. Perceivability is a function of the number of observables and the potential for personnel to detect those observables. If a technique includes effects which personnel may detect, such as deletion or modification of system files or required user execution, then the technique would be more perceivable.

  Differences in infrastructure and system configurations may present different challenges and opportunities for observable detection. For example, architecture-wide endpoint monitoring is likely to improve the perceivability of techniques which modify host files, such as the Data Destruction technique (T0809) for Inhibit Response Function and Theft of Operational Information technique (T0882) for Impact.

  Network monitoring and log analysis capabilities are likely to improve perceivability of techniques which create malicious network traffic, such as the Standard Application Layer Protocol technique (T0869) for Command and Control, External Remote Services technique (T0822) for Initial Access, and Connection Proxy technique (T0884) for Command and Control. Alternatively, enhancing the monitoring parameters of system files would increase the perceivability of techniques such as Data from Information Repositories technique (T0811) for Collection and the Service Stop technique (T0881) for Inhibit Response Function.

  Comprehension can be further enhanced by technique artifacts created when adversaries employ certain attack techniques. The CyOTE program provides organizations with a library of observables reported in each historical case. The library can be used in conjunction with a repository of artifacts, data sources, and technique detection references for practitioners and developers to support the comprehension of indicators of attack.`,

  cyoteTools: [
    {
      title: "Citrine in Deep Lynx",
      titleDialog: "Citrine in Deep Lynx",
      button: 'More...',
      link: '',
      images: ['/screenshots/Screenshot-Citrine.png'],
    },
    {
      title: "Practitioner's Dashboard",
      titleDialog: "Practitioner's Dashboard",
      button: 'More...',
      link: '',
      images: ['/screenshots/Screenshot-Practitioners-Dashboard-1.png', '/screenshots/Screenshot-Practitioners-Dashboard-2.png'],
    },
    {
      title: "Executive Dashboard",
      titleDialog: "Executive Dashboard",
      button: 'More...',
      link: '',
      images: ['/screenshots/Screenshot-Executive-Dashboard.png'],
    },
    {
      title: "Bayesian Attack Model",
      titleDialog: "Bayesian Attack Model",
      button: 'More...',
      link: '',
      images: ['/screenshots/Screenshot-BAM-1.png'],
    },
    {
      title: "Bayesian Attack Model Output",
      titleDialog: "Bayesian Attack Model Output",
      button: 'More...',
      link: '',
      images: ['/screenshots/Screenshot-BAM-2.png'],
    },

    {
      title: "OPTIC",
      titleDialog: "OPTIC",
      button: 'More...',
      link: '',
      images: ['/screenshots/Screenshot-OPTIC.png'],
    },
    {
      title: "CATCH Command Line GUI",
      titleDialog: "CATCH Command Line GUI",
      button: 'More...',
      link: '',
      images: ['/screenshots/Screenshot-CATCH.png'],
    },
    {
      title: "CATCH STIX in STIG Viewer",
      titleDialog: "CATCH STIX in STIG Viewer",
      button: 'More...',
      link: '',
      images: ['/screenshots/Screenshot-CATCH-STIG-Viewer.png'],
    },
  ],

  cyoteFullObservedTechniqueList: [
    {
      id: 0,
      tactic: 'Initial Access',
      techniques: [
        'Drive-by Compromise',
        'Exploit Public-Facing Application',
        'Exploitation of Remote Services',
        'External Remote Services',
        'Internet Accessible Device',
        'Remote Services',
        'Replication Through Removable Media',
        'Rogue Master',
        'Spearphishing Attachment',
        'Supply Chain Compromise',
        'Transient Cyber Asset',
        'Wireless Compromise'
      ]
    },
    {
      id: 1,
      tactic: 'Execution',
      techniques: [
        'Change Operating Mode',
        'Command-Line Interface',
        'Execution through API',
        'Graphical User Interface',
        'Hooking',
        'Native API',
        'Scripting',
        'User Execution'
      ]
    },
    {
      id: 2,
      tactic: 'Persistence',
      techniques: [
        'Modify Program',
        'Valid Accounts'
      ]
    },
    {
      id: 3,
      tactic: 'Privilege Escalation',
      techniques: [
        'Exploitation for Privilege Escalation',
        'Hooking'
      ]
    },
    {
      id: 4,
      tactic: 'Evasion',
      techniques: [
        'Change Operating Mode',
        'Exploitation for Evasion',
        'Indicator Removal on Host',
        'Masquerading',
        'Rootkit',
        'Spoof Reporting Message'
      ]
    },
    {
      id: 5,
      tactic: 'Discovery',
      techniques: [
        'Network Connection Enumeration',
        'Network Sniffing',
        'Remote System Discovery',
        'Remote System Information Discovery'
      ]
    },
    {
      id: 6,
      tactic: 'Lateral Movement',
      techniques: [
        'Default Credentials',
        'Exploitation of Remote Services',
        'Lateral Tool Transfer',
        'Program Download',
        'Remote Services',
        'Valid Accounts'
      ]
    },
    {
      id: 7,
      tactic: 'Collection',
      techniques: [
        'Automated Collection',
        'Data from Local System',
        'Detect Operating Mode',
        'Monitor Process State',
        'Point & Tag Identification',
        'Program Upload'
      ]
    },
    {
      id: 8,
      tactic: 'Command and Control',
      techniques: [
        'Commonly Used Port',
        'Connection Proxy',
        'Standard Application Layer Protocol'
      ]
    },
    {
      id: 9,
      tactic: 'Inhibit Response Function',
      techniques: [
        'Activate Firmware Update Mode',
        'Alarm Suppression',
        'Block Command Message',
        'Block Reporting Message',
        'Block Serial COM',
        'Data Destruction',
        'Denial of Service',
        'Device Restart/Shutdown',
        'Modify Alarm Settings',
        'Rootkit',
        'Service Stop',
        'System Firmware'
      ]
    },
    {
      id: 10,
      tactic: 'Impair Process Control',
      techniques: [
        'Brute Force I/O',
        'Modify Parameter',
        'Unauthorized Command Message'
      ]
    },
    {
      id: 11,
      tactic: 'Impact',
      techniques: [
        'Damage to Property',
        'Denial of Control',
        'Denial of View',
        'Loss of Availability',
        'Loss of Control',
        'Loss of Productivity and Revenue',
        'Loss of Protection',
        'Loss of Safety',
        'Loss of View',
        'Manipulation of Control',
        'Manipulation of View',
        'Theft of Operational Information'
      ]
    }
  ],

  overviewNumbers: [
    {
      title: 'Detection Capabilities',
      data: [
        {
          label: 'ICS Techniques Detection Capability',
          value: 18
        },
        {
          label: 'Detection Collection Engines',
          value: 14
        },
      ]
    },
    {
      title: 'Observable Information',
      data: [
        {
          label: 'Total Observables in Database',
          value: '14,039'
        },
        {
          label: 'Total Unique Indicators of Compromise',
          value: '6,089'
        },
        {
          label: 'Total Indicators of Attack',
          value: '7,936'
        },
      ]
    },
    {
      title: 'Attack Scenarios',
      data: [
        {
          label: 'Threat Analysis Reports',
          value: 27
        },
        {
          label: 'Threat Analysis Summary Report',
          value: 1
        },
      ]
    },
    {
      title: 'Attack Models',
      data: [
        {
          label: 'Bayesian Network Models',
          value: 27
        },
        {
          label: 'Unified Bayesian Network Model',
          value: 1
        },
      ]
    },
    {
      title: 'MITRE ATT&CK® for ICS Techniques',
      data: [
        {
          label: 'Total Number of Observed Techniques',
          value: 78
        },
        {
          label: 'Total Number of Possible Techniques',
          value: 92
        },
      ]
    },
  ],
  BAMGraph: [{ "Tech ID": "Nominal", "Technique": "No Adversary Behavior", "Tactic": "No Adversary Behavior", "Tick": 0, "D-Notation": "D-$\\infty$", "x": 0.0, "Early": 0.399999976, "Middle": 0.267399967, "Late": 0.234615982, "Impact": 0.232741833 }, { "Tech ID": "T0883", "Technique": "Internet Accessible Device", "Tactic": "Initial Access", "Tick": 1, "D-Notation": "D-51", "x": 20.0, "Early": 0.405176699, "Middle": 0.271030724, "Late": 0.235840738, "Impact": 0.234021246 }, { "Tech ID": "T0888", "Technique": "Remote System Information Discovery", "Tactic": "Discovery", "Tick": 1, "D-Notation": "D-51", "x": 25.0, "Early": 0.685498923, "Middle": 0.479803205, "Late": 0.334729493, "Impact": 0.313491464 }, { "Tech ID": "T0867", "Technique": "Lateral Tool Transfer", "Tactic": "Lateral Movement", "Tick": 1, "D-Notation": "D-51", "x": 30.0, "Early": 0.807653636, "Middle": 0.560978293, "Late": 0.348313212, "Impact": 0.338762522 }, { "Tech ID": "T0807", "Technique": "Command-Line Interface", "Tactic": "Execution", "Tick": 2, "D-Notation": "D-51", "x": 40.0, "Early": 0.864390358, "Middle": 0.562167317, "Late": 0.377525687, "Impact": 0.350043476 }, { "Tech ID": "T0853", "Technique": "Scripting", "Tactic": "Execution", "Tick": 2, "D-Notation": "D-51", "x": 45.0, "Early": 0.871286154, "Middle": 0.563297302, "Late": 0.382470667, "Impact": 0.35253787 }, { "Tech ID": "T0888", "Technique": "Remote System Information Discovery", "Tactic": "Discovery", "Tick": 2, "D-Notation": "D-51", "x": 50.0, "Early": 0.877989694, "Middle": 0.574430227, "Late": 0.383958638, "Impact": 0.356087089 }, { "Tech ID": "T0834", "Technique": "Native API", "Tactic": "Execution", "Tick": 3, "D-Notation": "H-1", "x": 72.5, "Early": 0.878907017, "Middle": 0.575719386, "Late": 0.386373699, "Impact": 0.357819498 }, { "Tech ID": "T0846", "Technique": "Remote System Discovery", "Tactic": "Discovery", "Tick": 3, "D-Notation": "H-1", "x": 77.5, "Early": 0.880372107, "Middle": 0.57949847, "Late": 0.386933148, "Impact": 0.359369695 }, { "Tech ID": "T0886", "Technique": "Remote Services", "Tactic": "Lateral Movement", "Tick": 4, "D-Notation": "H-1", "x": 92.5, "Early": 0.887695082, "Middle": 0.588288814, "Late": 0.388302743, "Impact": 0.362880409 }, { "Tech ID": "T0885", "Technique": "Commonly Used Port", "Tactic": "Command and Control", "Tick": 4, "D-Notation": "H-1", "x": 97.5, "Early": 0.909171991, "Middle": 0.584547043, "Late": 0.404539406, "Impact": 0.369000077 }, { "Tech ID": "T0859", "Technique": "Valid Accounts", "Tactic": "Persistence", "Tick": 5, "D-Notation": "H-1", "x": 112.5, "Early": 0.900714383, "Middle": 0.695727855, "Late": 0.46453023, "Impact": 0.410143554 }, { "Tech ID": "T0867", "Technique": "Lateral Tool Transfer", "Tactic": "Lateral Movement", "Tick": 5, "D-Notation": "H-1", "x": 117.5, "Early": 0.902270384, "Middle": 0.700826645, "Late": 0.468674421, "Impact": 0.414075196 }, { "Tech ID": "T0807", "Technique": "Command-Line Interface", "Tactic": "Execution", "Tick": 6, "D-Notation": "H-1", "x": 132.5, "Early": 0.903124787, "Middle": 0.702604532, "Late": 0.472235918, "Impact": 0.417057455 }, { "Tech ID": "T0872", "Technique": "Indicator Removal on Host", "Tactic": "Evasion", "Tick": 6, "D-Notation": "H-1", "x": 137.5, "Early": 0.908312596, "Middle": 0.740712136, "Late": 0.502134085, "Impact": 0.438927889 }, { "Tech ID": "T0849", "Technique": "Masquerading", "Tactic": "Evasion", "Tick": 7, "D-Notation": "H-1", "x": 150.0, "Early": 0.90973781, "Middle": 0.74889183, "Late": 0.510357529, "Impact": 0.445275545 }, { "Tech ID": "T0853", "Technique": "Scripting", "Tactic": "Execution", "Tick": 7, "D-Notation": "H-1", "x": 155.0, "Early": 0.910465986, "Middle": 0.75033173, "Late": 0.51349172, "Impact": 0.448020637 }, { "Tech ID": "T0834", "Technique": "Native API", "Tactic": "Execution", "Tick": 7, "D-Notation": "H-1", "x": 160.0, "Early": 0.910476178, "Middle": 0.750351936, "Late": 0.513535708, "Impact": 0.448059201 }, { "Tech ID": "T0881", "Technique": "Service Stop", "Tactic": "Inhibit Response Function", "Tick": 8, "D-Notation": "H-1", "x": 170.0, "Early": 0.919078276, "Middle": 0.76135838, "Late": 0.534424186, "Impact": 0.501501322 }, { "Tech ID": "T0869", "Technique": "Standard Application Layer Protocol", "Tactic": "Command and Control", "Tick": 8, "D-Notation": "H-1", "x": 175.0, "Early": 0.921822824, "Middle": 0.762857437, "Late": 0.539793223, "Impact": 0.505236119 }, { "Tech ID": "T0885", "Technique": "Commonly Used Port", "Tactic": "Command and Control", "Tick": 8, "D-Notation": "H-1", "x": 180.0, "Early": 0.922924504, "Middle": 0.765092358, "Late": 0.544693142, "Impact": 0.509303957 }, { "Tech ID": "T0840", "Technique": "Network Connection Enumeration", "Tactic": "Discovery", "Tick": 9, "D-Notation": "H-1", "x": 190.0, "Early": 0.924727157, "Middle": 0.770907134, "Late": 0.54752785, "Impact": 0.514128476 }, { "Tech ID": "T0834", "Technique": "Native API", "Tactic": "Execution", "Tick": 9, "D-Notation": "H-1", "x": 195.0, "Early": 0.925586827, "Middle": 0.772941217, "Late": 0.55188942, "Impact": 0.517782003 }, { "Tech ID": "T0806", "Technique": "Brute Force I/O", "Tactic": "Impair Process Control", "Tick": 9, "D-Notation": "H-1", "x": 200.0, "Early": 0.931185573, "Middle": 0.793013692, "Late": 0.585764259, "Impact": 0.577961355 }, { "Tech ID": "T0855", "Technique": "Unauthorized Command Message", "Tactic": "Impair Process Control", "Tick": 10, "D-Notation": "D0", "x": 210.0, "Early": 0.935350254, "Middle": 0.806254685, "Late": 0.608406901, "Impact": 0.616212279 }, { "Tech ID": "T0831", "Technique": "Manipulation of Control", "Tactic": "Impact", "Tick": 10, "D-Notation": "D0", "x": 215.0, "Early": 0.93610771, "Middle": 0.874991506, "Late": 0.735451996, "Impact": 0.908860959 }, { "Tech ID": "T0872", "Technique": "Indicator Removal on Host", "Tactic": "Evasion", "Tick": 10, "D-Notation": "D0", "x": 220.0, "Early": 0.938024588, "Middle": 0.879213452, "Late": 0.743902564, "Impact": 0.911333673 }, { "Tech ID": "T0809", "Technique": "Data Destruction", "Tactic": "Inhibit Response Function", "Tick": 11, "D-Notation": "m+10", "x": 232.5, "Early": 0.939231951, "Middle": 0.878148802, "Late": 0.743244916, "Impact": 0.920322493 }, { "Tech ID": "T0816", "Technique": "Device Restart/Shutdown", "Tactic": "Inhibit Response Function", "Tick": 11, "D-Notation": "m+10", "x": 237.5, "Early": 0.939227983, "Middle": 0.863090366, "Late": 0.720239431, "Impact": 0.953534368 }, { "Tech ID": "T0826", "Technique": "Loss of Availability", "Tactic": "Impact", "Tick": 12, "D-Notation": "m+10", "x": 250.0, "Early": 0.939500112, "Middle": 0.873445854, "Late": 0.74274689, "Impact": 0.995832145 }, { "Tech ID": "T0827", "Technique": "Loss of Control", "Tactic": "Impact", "Tick": 12, "D-Notation": "m+10", "x": 255.0, "Early": 0.93999226, "Middle": 0.877194166, "Late": 0.754289493, "Impact": 0.999260128 }, { "Tech ID": "T0872", "Technique": "Indicator Removal on Host", "Tactic": "Evasion", "Tick": 12, "D-Notation": "m+10", "x": 260.0, "Early": 0.941841446, "Middle": 0.881325431, "Late": 0.762390941, "Impact": 0.999280773 }],
  pageTextAnalysisDesc: {
    title: 'TISafe Incident Hub',
    pageDesc: `Explore a diverse array of techniques for text analysis on this interactive web page. From topic modeling and text classification to semantic similarity and named entity recognition, discover how these methods can be applied to your data set. Enhance your understanding and gain valuable insights by leveraging state-of-the-art AI and machine learning tools in text analysis.`,
    dialogText: `The data source for the web page is the TISafe Incident Hub database, accessible at TISafe Base de Dados (https://hub.tisafe.com/base-de-dados/). This database provides detailed incident data, which is utilized for text analysis and machine learning purposes. The database includes various data types, such as cybersecurity incidents, facilitating comprehensive analysis and visualization. For further details, you can visit the provided link.`
  },
  pageTextAnalysisGraphs: {
    dynamicTopicModel: {
      title: 'Dynamic Topic Modeling and Incident Data Analysis',
      dialogTitle: 'Dynamic Topic Modeling and Incident Data Analysis',
      dialogText: `
        <div>
          <p>
            Dynamic Topic Modeling (DTM) is a method used to analyze the evolution of topics in a collection of documents over time. Unlike traditional topic modeling, which provides a static snapshot of topics, DTM can capture how topics change and develop. This is particularly useful for understanding trends, emerging issues, and shifts in focus within large text corpora.
          </p>
          <br />
          <p>
            In this case, the "incidents.csv" file, located on the hub.tisafe.com site, was used as the data source. This dataset contains records of various incidents, including details and dates. Using Dynamic Topic Models, the text data from the incidents was analyzed to identify and track the frequency of words over the years. The output of this analysis is a visualization of word count frequencies, showing how certain words and topics have varied in prominence over time, providing insights into the evolution of incident trends that impacted OT systems.
          </p>
        </div>
      `
    },
    intertopicDistanceMapping: {
      title: 'Intertopic Distance Mapping and Incident Data Analysis',
      dialogTitle: 'Intertopic Distance Mapping and Incident Data Analysis',
      dialogText: `
        <div>
          <p>
            Intertopic Distance Mapping (ITDM) is a visualization technique used to represent the relationships between topics identified in a text corpus. This method often uses models like Latent Dirichlet Allocation (LDA) to generate topics and then maps these topics in a two-dimensional space to show their distances from each other, typically using techniques such as Multidimensional Scaling (MDS) or t-SNE (t-distributed Stochastic Neighbor Embedding).
          </p>
          <br />
          <p>
            In this case, the "incidents.csv" file, located at <a href="https://hub.tisafe.com">hub.tisafe.com</a>, was used as the data source. The dataset contains records of various incidents, including details and dates. Using an LDA model, topics were extracted from the text data, and an Intertopic Distance Map was created to visualize these topics.
          </p>
          <br />
          <p>Interpreting the Intertopic Distance Map:</p>
          <ul>
            <li style="list-style-type: disc; margin-left: 20px">
              <strong>Topic Clusters:</strong> Topics that are closer together on the map indicate that they share more words and are more similar in content. Conversely, topics that are further apart are less similar.
            </li>
            <li style="list-style-type: disc; margin-left: 20px">
              <strong>Size of Circles:</strong> The size of each circle on the map represents the prevalence of the topic in the corpus. Larger circles indicate more prominent topics.
            </li>
            <li style="list-style-type: disc; margin-left: 20px">
            <strong>Interpretation:</strong> By examining the map, users can identify which topics are closely related, observe distinct topic clusters, and understand the overall landscape of the text data. This helps in identifying key themes and their interrelations within the incident records.
            </li>
          </ul>
          <br />
          <p>
            This visualization aids in gaining insights into the structure and relationships of topics within the incident data, allowing for a more comprehensive understanding of the underlying patterns and themes.
          </p>
        </div>
      `
    },
    topicSimilarityMatrix: {
      title: 'Topic Similarity Confusion Matrix and Incident Data Analysis',
      dialogTitle: 'Topic Similarity Confusion Matrix and Incident Data Analysis',
      dialogText: `
        <div>
          <p>
            The Topic Similarity Confusion Matrix is a visualization technique used to display the similarities and differences between identified topics in a text corpus. This method often leverages models such as Latent Dirichlet Allocation (LDA) or other topic modeling algorithms to extract topics from the text. The confusion matrix then represents the pairwise similarity scores between topics, providing a detailed view of how closely related different topics are.
            In this case, the "incidents.csv" file, located at hub.tisafe.com was used as the data source. The dataset contains records of various incidents, including details and dates. Using an LDA model, topics were extracted from the text data, and a Topic Similarity Confusion Matrix was generated to visualize the similarities between these topics.
          </p>
          <br />
          <p>
            Interpreting the Topic Similarity Confusion Matrix:
          </p>
          <ul>
            <li style="list-style-type: disc; margin-left: 20px">
              <strong>Matrix Cells:</strong> Each cell in the matrix represents the similarity score between two topics. Higher scores indicate greater similarity, meaning the topics share more words and content.
            </li>
            <li style="list-style-type: disc; margin-left: 20px">
              <strong>Diagonal Values:</strong> The diagonal cells represent the similarity of each topic to itself, which will always have the highest score (typically normalized to 1 or 100%).
            </li>
            <li style="list-style-type: disc; margin-left: 20px">
              <strong>Color Gradient:</strong> The cells are often color-coded, with darker or more intense colors representing higher similarity scores. This visual cue helps quickly identify which topics are more closely related.
            </li>
            <li style="list-style-type: disc; margin-left: 20px">
              <strong>Row and Column Labels:</strong> The matrix rows and columns are labeled with the topic numbers or names, allowing users to cross-reference and understand which topics are being compared.
            </li>
          </ul>
          </br />
          <p>
            This visualization aids in understanding the relationships between topics in the incident data. By examining the matrix, users can identify which topics are similar, spot potential redundancies, and gain a clearer understanding of the thematic structure within the incident records. This detailed view of topic similarities enhances the analysis by providing a quantitative measure of topic relationships.
          </p>
        </div>      
      `
    },
    topicHierarchicalClustering: {
      title: 'Topic Hierarchical Clustering and Incident Data Analysis',
      dialogTitle: 'Topic Hierarchical Clustering and Incident Data Analysis',
      dialogText: `
        <div>
          <p>
            Topic Hierarchical Clustering is a method used to organize topics identified in a text corpus into a hierarchical structure based on their similarities. This approach often uses models like Latent Dirichlet Allocation (LDA) to generate topics and then applies hierarchical clustering algorithms (e.g., agglomerative clustering) to group these topics into a dendrogram, showing their relationships in a tree-like structure.
          </p>
          <br />
          <p>
            In this case, the "incidents.csv" file, located at hub.tisafe.com, was used as the data source. The dataset contains records of various incidents, including details and dates. Using an LDA model, topics were extracted from the text data, and hierarchical clustering was applied to create a dendrogram that visualizes the topic relationships.
          </p>
          <br />
          <p>
            Interpreting the Topic Hierarchical Clustering Dendrogram:
          </p>
          <ul>
            <li style="list-style-type: disc; margin-left: 20px">
              <strong>Branches and Nodes:</strong> The dendrogram consists of branches and nodes. Each node represents a topic, and branches connect topics based on their similarities. The length of the branches indicates the distance or dissimilarity between topics.
            </li>
            <li style="list-style-type: disc; margin-left: 20px">
              <strong>Clusters:</strong> Topics that are closer together (connected by shorter branches) are more similar and form clusters. These clusters represent groups of topics that share common themes.
            </li>
            <li style="list-style-type: disc; margin-left: 20px">
              <strong>Tree Levels:</strong> The hierarchical structure has multiple levels, with the root at the top and individual topics at the leaves. Higher levels represent broader groupings, while lower levels show more specific topic clusters.
            </li>  
            <li style="list-style-type: disc; margin-left: 20px">
              <strong>Interpretation:</strong> By examining the dendrogram, users can identify how topics are grouped, understand the hierarchical relationships between them, and see the overall structure of themes within the incident records.
            </li>
          </ul>
          <br />
          <p>
            This visualization aids in comprehensively understanding the relationships and structure of topics in the incident data. It provides a clear, hierarchical view of how topics are related, helping to identify key themes and their subtopics within the dataset.
          </p>
        </div>
      `
    },
    topicWordScores: {
      title: 'Topic Word Scores with Words and Probabilities and Incident Data Analysis',
      dialogTitle: 'Topic Word Scores with Words and Probabilities and Incident Data Analysis',
      dialogText: `
        <div>
          <p>
            Topic Word Scores with Words and Probabilities is a method used to display the most significant words for each identified topic in a text corpus, along with their associated probabilities. This approach typically uses models such as Latent Dirichlet Allocation (LDA) to generate topics and then ranks the words within each topic based on their relevance and contribution to the topic.
          </p>
          <br />
          <p>
            In this case, the "incidents.csv" file, located at hub.tisafe.com, was used as the data source. The dataset contains records of various incidents, including details and dates. Using an LDA model, topics were extracted from the text data, and word scores with their probabilities were calculated for each topic.
          </p>
          <br />
          <p>
            Interpreting the Topic Word Scores:
          </p>
          <ul>
            <li style="list-style-type: disc; margin-left: 20px">
              <strong>Words and Probabilities:</strong> Each topic is represented by a list of significant words along with their probabilities. The probability indicates how likely a word is to belong to that topic.
            </li>
            <li style="list-style-type: disc; margin-left: 20px"> 
              <strong>Ranking:</strong> Words are ranked based on their probabilities, with the highest probability words listed first. These top words are the most representative of the topic.
            </li>
            <li style="list-style-type: disc; margin-left: 20px">
              <strong>Topic Labels:</strong> Each topic has a label or identifier, allowing users to associate the words and probabilities with the specific topic.
            </li>
            <li style="list-style-type: disc; margin-left: 20px">
              <strong>Interpretation:</strong> By examining the word scores, users can understand the key terms that define each topic, gain insights into the content and themes of the topics, and interpret the relevance of different words within the context of the incident records.
            </li>
          </ul>
          <br />
          <p>
            This visualization aids in identifying the most important words for each topic, providing a detailed view of the linguistic makeup of the topics in the incident data. It helps to understand the key terms and their significance within each topic, enhancing the overall analysis and interpretation of the dataset.
          </p>
        </div>
      `
    },
  },

  helpTopics: {
    financialLossByAmountRange: {
      title: 'More Information',
      dialogTitle: 'Overview of the Plot: Financial Loss by Amount Range',
      dialogText: `
        <div className="dark:text-neutralc-100 text-neutralc-900">
          <p className="mb-4">
            This plot illustrates the financial impact of OT cyberattacks reported between 2000 and 2022, using real incident data.
            It estimates financial loss due to disruptions at a base rate of <span class="font-semibold">$5,600 per minute</span>,
            with the x-axis representing financial loss in millions of dollars, ranging from <span class="font-semibold">$0 to $11.641 billion</span>,
            and the y-axis showing the count of incidents over 22 years.
          </p>
          <ul className="list-disc ml-8 mb-4">
            <li><span className="text-primary-500 font-semibold">Blue bars</span> represent the count of Maximum Financial Loss incidents.</li>
            <li><span className="text-error font-semibold">Red bars</span> represent the count of Minimum Financial Loss incidents.</li>
            <li>A <span className="text-success font-semibold">green line</span> shows the distribution of maximum losses using Kernel Density Estimation (KDE), visualizing the probability distribution of financial losses.</li>
            <li>An <span className="text-warning font-semibold">orange line</span> shows the distribution of minimum losses using KDE.</li>
          </ul>
          <p>
            This visualization highlights key financial thresholds and risk exposure, offering a comprehensive view of potential OT cybersecurity costs.
          </p>
          <hr className="border-t border-neutralc-500 my-4">
          <h2 className="text-xl font-semibold mb-4">Key Insights:</h2>
          <ol className="list-decimal ml-8">
            <li className="mb-4">
              <span className="font-bold">Critical Risk Threshold ($970 Million):</span><br> Both the maximum and minimum financial loss distributions intersect at approximately $970 million, making this a significant threshold for financial risk. This range should be a primary focus for risk mitigation and response planning.
            </li>
            <li className="mb-4">
              <span className="font-bold">Frequent Small to Mid-Range Losses:</span><br> The tall peak in the Minimum Financial Loss KDE below $243 million shows that the majority of incidents fall within this range. This suggests that organizations should prioritize managing frequent, smaller losses to prevent the cumulative impact from escalating.
            </li>
            <li className="mb-4">
              <span className="font-bold">High-Impact Events Can Be Catastrophic:</span><br> Peaks at $4.6-$4.8 billion (minimum) and $5.3 billion (maximum) highlight the potential for rare but catastrophic financial losses. Executives should plan for these high-damage, low-frequency events through comprehensive incident response and resilience strategies.
            </li>
            <li className="mb-4">
              <span class="font-bold">Focus on $243 Million for Risk Mitigation:</span><br> Both the maximum and minimum financial loss distributions converge around $243 million, indicating this as a critical focus for mitigation efforts. Targeting this loss range could significantly reduce the overall financial risk exposure.
            </li>
            <li className="mb-4">
              <span class="font-bold">Preparation for Large-Scale, Billion-Dollar Incidents:</span><br> Though infrequent, billion-dollar losses are a serious concern as seen in the secondary peaks. Executives should ensure their cybersecurity measures are robust enough to address these potential high-impact incidents.
            </li>
          </ol>
        </div>
      `
    },
  }
}

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    // App functions
    toggleDrawer: (state) => {
      const store = state;
      store.openDrawerLeft = !store.openDrawerLeft;
    },
    setDrawerLeftWidth: (state, action) => {
      const store = state;
      store.openDrawerLeftWidth = action.payload;
    },
    toggleDrawerRight: (state) => {
      const store = state;
      store.openDrawerRight = !store.openDrawerRight;
    },
    setSelectedReport: (state, action) => {
      const store = state;
      store.selectedReport = action.payload;
    },
  },
});

// Test users
export const tmpCurrentUser: User = { Role: 'SuperUser', Id: '000000', Email: 'johnDoe@email.com', FirstName: 'John', LastName: 'Doe', Username: 'JohnDoe', Token: 'ThisIsTheTempTokenForJohnDoe', Title: 'Mr.' }
// export const tmpExecUser: User = { Role: 'Executive', Id: '000000', Email: 'execuser@email.com', FirstName: 'My name is Executive', LastName: 'User', Username: 'execuser', Token: 'ThisIsTheTempToken0', Title: 'Mr.' }
// export const tmpAnalystUser: User = { Role: 'Analyst', Id: '111111', Email: 'analystuser@email.com', FirstName: 'Analyst', LastName: 'User', Username: 'analystuser', Token: 'ThisIsTheTempToken1', Title: 'Mr.' }
//export const tmpDemoUser: User = { Role: 'Demo', Id: '222222', Email: 'demouser@email.com', FirstName: 'Demo', LastName: 'User', Username: 'demouser', Token: 'ThisIsTheTempToken2', Title: 'Mr.' }

export const store = configureStore({
  reducer: {
    appState: appStateSlice.reducer,
    [allAttacksStatsDataApi.reducerPath]: allAttacksStatsDataApi.reducer,
    [allAttacksMetricsDataApi.reducerPath]: allAttacksMetricsDataApi.reducer,
    [allAttacksReportDataApi.reducerPath]: allAttacksReportDataApi.reducer,
    [mitreAttackMatrixApi.reducerPath]: mitreAttackMatrixApi.reducer,
    [tacticTechniquesStatsApi.reducerPath]: tacticTechniquesStatsApi.reducer,
    [attackBamDataApi.reducerPath]: attackBamDataApi.reducer,
    [observablesDataApi.reducerPath]: observablesDataApi.reducer,  // ADD
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(allAttacksStatsDataApi.middleware)
      .concat(allAttacksMetricsDataApi.middleware)
      .concat(allAttacksReportDataApi.middleware)
      .concat(mitreAttackMatrixApi.middleware)
      .concat(tacticTechniquesStatsApi.middleware)
      .concat(attackBamDataApi.middleware)
      .concat(observablesDataApi.middleware);  // ADD
  },
});

export const appStateActions = appStateSlice.actions;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
