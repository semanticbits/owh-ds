(function(){
    'use strict';
    angular
        .module('owh.services')
        .service('cancerSiteService', cancerSiteService);

    cancerSiteService.$inject = [];

    function cancerSiteService () {
        return {
            getSites: getSites,
            getList: getList
        }
    }

    function getSites () {
        return [
            {
                text: 'Oral Cavity and Pharynx',
                id: '20010-20100',
                children: [
                    {
                        text: 'Lip',
                        id: '20010',
                        children: [],
                        path: [
                          "20010",
                          "20010-20100",
                          "0"
                        ]
                    },
                    {
                        text: 'Tongue',
                        id: '20020',
                        children: [],
                        path: [
                          "20020",
                          "20010-20100",
                          "0"
                        ]
                    },
                    {
                        text: 'Salivary Gland',
                        id: '20030',
                        children: [],
                        path: [
                          "20030",
                          "20010-20100",
                          "0"
                        ]
                    },
                    {
                        text: 'Floor of Mouth',
                        id: '20040',
                        children: [],
                        path: [
                          "20040",
                          "20010-20100",
                          "0"
                        ]
                    },
                    {
                        text: 'Gum and Other Mouth',
                        id: '20050',
                        children: [],
                        path: [
                          "20050",
                          "20010-20100",
                          "0"
                        ]
                    },
                    {
                        text: 'Nasopharynx',
                        id: '20060',
                        children: [],
                        path: [
                          "20060",
                          "20010-20100",
                          "0"
                        ]
                    },
                    {
                        text: 'Tonsil',
                        id: '20070',
                        children: [],
                        path: [
                          "20070",
                          "20010-20100",
                          "0"
                        ]
                    },
                    {
                        text: 'Oropharynx',
                        id: '20080',
                        children: [],
                        path: [
                          "20080",
                          "20010-20100",
                          "0"
                        ]
                    },
                    {
                        text: 'Hypopharynx',
                        id: '20090',
                        children: [],
                        path: [
                          "20090",
                          "20010-20100",
                          "0"
                        ]
                    },
                    {
                        text: 'Other Oral Cavity and Pharynx',
                        id: '20100',
                        children: [],
                        path: [
                          "20100",
                          "20010-20100",
                          "0"
                        ]
                    }
                ],
                path: [
                  "20010-20100",
                  "0"
                ]
            },
            {
                text: 'Digestive System',
                id: '21010-21130',
                children: [
                    {
                        text: 'Esophagus',
                        id: '21010',
                        children: [],
                        path: [
                          "21010",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Stomach',
                        id: '21020',
                        children: [],
                        path: [
                          "21020",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Small Intestine',
                        id: '21030',
                        children: [],
                        path: [
                          "21030",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Colon and Rectum',
                        id: '21041-21052',
                        children: [
                            {
                                text: 'Colon excluding Rectum',
                                id: '21041-21049',
                                children: [
                                    {
                                        text: 'Cecum',
                                        id: '21041',
                                        children: [],
                                        path: [
                                          "21041",
                                          "21041-21049",
                                          "21041-21052",
                                          "21010-21130",
                                          "0"
                                        ]
                                    },
                                    {
                                        text: 'Appendix',
                                        id: '21042',
                                        children: [],
                                        path: [
                                          "21042",
                                          "21041-21049",
                                          "21041-21052",
                                          "21010-21130",
                                          "0"
                                        ]
                                    },
                                    {
                                        text: 'Ascending Colon',
                                        id: '21043',
                                        children: [],
                                        path: [
                                          "21043",
                                          "21041-21049",
                                          "21041-21052",
                                          "21010-21130",
                                          "0"
                                        ]
                                    },
                                    {
                                        text: 'Hepatic Flexure',
                                        id: '21044',
                                        children: [],
                                        path: [
                                          "21044",
                                          "21041-21049",
                                          "21041-21052",
                                          "21010-21130",
                                          "0"
                                        ]
                                    },
                                    {
                                        text: 'Transverse Colon',
                                        id: '21045',
                                        children: [],
                                        path: [
                                          "21045",
                                          "21041-21049",
                                          "21041-21052",
                                          "21010-21130",
                                          "0"
                                        ]
                                    },
                                    {
                                        text: 'Splenic Flexure',
                                        id: '21046',
                                        children: [],
                                        path: [
                                          "21046",
                                          "21041-21049",
                                          "21041-21052",
                                          "21010-21130",
                                          "0"
                                        ]
                                    },
                                    {
                                        text: 'Descending Colon',
                                        id: '21047',
                                        children: [],
                                        path: [
                                          "21047",
                                          "21041-21049",
                                          "21041-21052",
                                          "21010-21130",
                                          "0"
                                        ]
                                    },
                                    {
                                        text: 'Sigmoid Colon',
                                        id: '21048',
                                        children: [],
                                        path: [
                                          "21048",
                                          "21041-21049",
                                          "21041-21052",
                                          "21010-21130",
                                          "0"
                                        ]
                                    },
                                    {
                                        text: 'Large Intestine, NOS',
                                        id: '21049',
                                        children: [],
                                        path: [
                                          "21049",
                                          "21041-21049",
                                          "21041-21052",
                                          "21010-21130",
                                          "0"
                                        ]
                                    }
                                ],
                                path: [
                                  "21041-21049",
                                  "21041-21052",
                                  "21010-21130",
                                  "0"
                                ]
                            },
                            {
                                text: 'Rectum and Rectosigmoid Junction',
                                id: '21051-21052',
                                children: [
                                    {
                                        text: 'Rectosigmoid Junction',
                                        id: '21051',
                                        children: [],
                                        path: [
                                          "21051",
                                          "21051-21052",
                                          "21041-21052",
                                          "21010-21130",
                                          "0"
                                        ]
                                    },
                                    {
                                        text: 'Rectum',
                                        id: '21052',
                                        children: [],
                                        path: [
                                          "21052",
                                          "21051-21052",
                                          "21041-21052",
                                          "21010-21130",
                                          "0"
                                        ]
                                    }
                                ],
                                path: [
                                  "21051-21052",
                                  "21041-21052",
                                  "21010-21130",
                                  "0"
                                ]
                            }
                        ],
                        path: [
                          "21041-21052",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Anus, Anal Canal and Anorectum',
                        id: '21060',
                        children: [],
                        path: [
                          "21060",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Liver and Intrahepatic Bile Duc',
                        id: '21071-21072',
                        children: [
                            {
                                text: 'Liver',
                                id: '21071',
                                children: [],
                                path: [
                                  "21071",
                                  "21071-21072",
                                  "21010-21130",
                                  "0"
                                ]
                            },
                            {
                                text: 'Intrahepatic Bile Duct',
                                id: '21072',
                                children: [],
                                path: [
                                  "21072",
                                  "21071-21072",
                                  "21010-21130",
                                  "0"
                                ]
                            }
                        ],
                        path: [
                          "21071-21072",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Gallbladder',
                        id: '21080',
                        children: [],
                        path: [
                          "21080",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Other Biliary',
                        id: '21090',
                        children: [],
                        path: [
                          "21090",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Pancreas',
                        id: '21100',
                        children: [],
                        path: [
                          "21100",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Retroperitoneum',
                        id: '21110',
                        children: [],
                        path: [
                          "21110",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Peritoneum, Omentum and Mesentery',
                        id: '21120',
                        children: [],
                        path: [
                          "21120",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Other Digestive Organs',
                        id: '21130',
                        children: [],
                        path: [
                          "21130",
                          "21010-21130",
                          "0"
                        ]
                    }
                ],
                path: [
                  "21010-21130",
                  "0"
                ]
            },
            {
                text: 'Respiratory System',
                id: '22010-22060',
                children: [
                    {
                        text: 'Nose, Nasal Cavity and Middle Ear',
                        id: '22010',
                        children: [],
                        path: [
                          "22010",
                          "22010-22060",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Larynx',
                        id: '22020',
                        children: [],
                        path: [
                          "22020",
                          "22010-22060",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Lung and Bronchus',
                        id: '22030',
                        children: [],
                        path: [
                          "22030",
                          "22010-22060",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Pleura',
                        id: '22050',
                        children: [],
                        path: [
                          "22050",
                          "22010-22060",
                          "21010-21130",
                          "0"
                        ]
                    },
                    {
                        text: 'Trachea, Mediastinum and Other Respiratory Organs',
                        id: '22060',
                        children: [],
                        path: [
                          "22060",
                          "22010-22060",
                          "21010-21130",
                          "0"
                        ]
                    }
                ],
                path: [
                  "22010-22060",
                  "21010-21130",
                  "0"
                ]
            },
            {
                text: 'Bones and Joints',
                id: '23000',
                children: [],
                path: [
                  "23000",
                  "0"
                ]
            },
            {
                text: 'Soft Tissue including Heart',
                id: '24000',
                children: [],
                path: [
                  "24000",
                  "0"
                ]
            },
            {
                text: 'Skin excluding Basal and Squamous',
                id: '25010-25020',
                children: [
                    {
                        text: 'Melanoma of the Skin',
                        id: '25010',
                        children: [],
                        path: [
                          "25010",
                          "25010-25020",
                          "0"
                        ]
                    },
                    {
                        text: 'Other Non-Epithelial Skin',
                        id: '25020',
                        children: [],
                        path: [
                          "25020",
                          "25010-25020",
                          "0"
                        ]
                    }
                ],
                path: [
                  "25010-25020",
                  "0"
                ]
            },
            {
                text: 'Male and Female Breast',
                id: '26000',
                children: [
                    {
                        text: 'Female Breast',
                        id: '26000-Female',
                        children: [],
                        path: [
                          "26000-Female",
                          "26000",
                          "0"
                        ]
                    },
                    {
                        text: 'Male Breast',
                        id: '26000-Male',
                        children: [],
                        path: [
                          "26000-Male",
                          "26000",
                          "0"
                        ]
                    }
                ],
                path: [
                  "26000",
                  "0"
                ]
            },
            {
                text: 'Female Genital System',
                id: '27010-27070',
                children: [
                    {
                        text: 'Cervix Uteri',
                        id: '27010',
                        children: [],
                        path: [
                          "27010",
                          "27010-27070",
                          "0"
                        ]
                    },
                    {
                        text: 'Corpus Uteri',
                        id: '27020',
                        children: [],
                        path: [
                          "27020",
                          "27010-27070",
                          "0"
                        ]
                    },
                    {
                        text: 'Uterus, NOS',
                        id: '27030',
                        children: [],
                        path: [
                          "27030",
                          "27010-27070",
                          "0"
                        ]
                    },
                    {
                        text: 'Ovary',
                        id: '27040',
                        children: [],
                        path: [
                          "27040",
                          "27010-27070",
                          "0"
                        ]
                    },
                    {
                        text: 'Vagina',
                        id: '27050',
                        children: [],
                        path: [
                          "27050",
                          "27010-27070",
                          "0"
                        ]
                    },
                    {
                        text: 'Vulva',
                        id: '27060',
                        children: [],
                        path: [
                          "27060",
                          "27010-27070",
                          "0"
                        ]
                    },
                    {
                        text: 'Other Female Genital Organs',
                        id: '27070',
                        children: [],
                        path: [
                          "27070",
                          "27010-27070",
                          "0"
                        ]
                    }
                ],
                path: [
                  "27010-27070",
                  "0"
                ]
            },
            {
                text: 'Male Genital System',
                id: '28010-28040',
                children: [
                    {
                        text: 'Prostate',
                        id: '28010',
                        children: [],
                        path: [
                          "28010",
                          "28010-28040",
                          "0"
                        ]
                    },
                    {
                        text: 'Testis',
                        id: '28020',
                        children: [],
                        path: [
                          "28020",
                          "28010-28040",
                          "0"
                        ]
                    },
                    {
                        text: 'Penis',
                        id: '28030',
                        children: [],
                        path: [
                          "28030",
                          "28010-28040",
                          "0"
                        ]
                    },
                    {
                        text: 'Other Male Genital Organs',
                        id: '28040',
                        children: [],
                        path: [
                          "28040",
                          "28010-28040",
                          "0"
                        ]
                    }
                ],
                path: [
                  "28010-28040",
                  "0"
                ]
            },
            {
                text: 'Urinary System',
                id: '29010-29040',
                children: [
                    {
                        text: 'Urinary Bladder, invasive and in situ',
                        id: '29010',
                        children: [],
                        path: [
                          "29010",
                          "29010-29040",
                          "0"
                        ]
                    },
                    {
                        text: 'Kidney and Renal Pelvis',
                        id: '29020',
                        children: [],
                        path: [
                          "29020",
                          "29010-29040",
                          "0"
                        ]
                    },
                    {
                        text: 'Ureter',
                        id: '29030',
                        children: [],
                        path: [
                          "29030",
                          "29010-29040",
                          "0"
                        ]
                    },
                    {
                        text: 'Other Urinary Organs',
                        id: '29040',
                        children: [],
                        path: [
                          "29030",
                          "29010-29040",
                          "0"
                        ]
                    }
                ],
                path: [
                  "29010-29040",
                  "0"
                ]
            },
            {
                text: 'Eye and Orbit',
                id: '30000',
                children: [],
                path: [
                  "30000",
                  "0"
                ]
            },
            {
                text: 'Brain and Other Nervous System',
                id: '31010-31040',
                children: [
                    {
                        text: 'Brain',
                        id: '31010',
                        children: [],
                        path: [
                          "31010",
                          "31010-31040",
                          "0"
                        ]
                    },
                    {
                        text: 'Cranial Nerves Other Nervous System',
                        id: '31040',
                        children: [],
                        path: [
                          "31040",
                          "31010-31040",
                          "0"
                        ]
                    }
                ],
                path: [
                  "31010-31040",
                  "0"
                ]
            },
            {
                text: 'Endocrine System',
                id: '32010-32020',
                children: [
                    {
                        text: 'Thyroid',
                        id: '32010',
                        children: [],
                        path: [
                          "32010",
                          "32010-32020",
                          "0"
                        ]
                    },
                    {
                        text: 'Other Endocrine including Thymus',
                        id: '32020',
                        children: [],
                        path: [
                          "32020",
                          "32010-32020",
                          "0"
                        ]
                    }
                ],
                path: [
                  "32010-32020",
                  "0"
                ]
            },
            {
                text: 'Lymphomas',
                id: '33011-33042',
                children: [
                    {
                        text: 'Hodgkin Lymphoma',
                        id: '33011-33012',
                        children: [
                            {
                                text: 'Hodgkin - Nodal',
                                id: '33011',
                                children: [],
                                path: [
                                  "33011",
                                  "33011-33012",
                                  "33011-33042",
                                  "0"
                                ]
                            },
                            {
                                text: 'Hodgkin - Extranodal',
                                id: '33012',
                                children: [],
                                path: [
                                  "33012",
                                  "33011-33012",
                                  "33011-33042",
                                  "0"
                                ]
                            }
                        ],
                        path: [
                          "33011-33012",
                          "33011-33042",
                          "0"
                        ]
                    },
                    {
                        text: 'Non-Hodgkin Lymphoma',
                        id: '33041-33042',
                        children: [
                            {
                                text: 'NHL – Nodal',
                                id: '33041',
                                children: [],
                                path: [
                                  "33041",
                                  "33041-33042",
                                  "33011-33042",
                                  "0"
                                ]
                            },
                            {
                                text: 'NHL – Extranodal',
                                id: '33042',
                                children: [],
                                path: [
                                  "33042",
                                  "33041-33042",
                                  "33011-33042",
                                  "0"
                                ]
                            }
                        ],
                        path: [
                          "33041-33042",
                          "33011-33042",
                          "0"
                        ]
                    }
                ],
                path: [
                  "33011-33042",
                  "0"
                ]
            },
            {
                text: 'Myeloma',
                id: '34000',
                children: [],
                path: [
                  "34000",
                  "0"
                ]
            },
            {
                text: 'Leukemias',
                id: '35011-35043',
                children: [
                    {
                        text: 'Acute Lymphocytic Leukemia',
                        id: '35011',
                        children: [],
                        path: [
                          "35011",
                          "35011-35043",
                          "0"
                        ]
                    },
                    {
                        text: 'Chronic Lymphocytic Leukemia',
                        id: '35012',
                        children: [],
                        path: [
                          "35012",
                          "35011-35043",
                          "0"
                        ]
                    },
                    {
                        text: 'Acute Myeloid Leukemia',
                        id: '35021',
                        children: [],
                        path: [
                          "35021",
                          "35011-35043",
                          "0"
                        ]
                    },
                    {
                        text: 'Chronic Myeloid Leukemia',
                        id: '35022',
                        children: [],
                        path: [
                          "35022",
                          "35011-35043",
                          "0"
                        ]
                    },
                    {
                        text: 'Other Leukemias',
                        id: '35041-35043',
                        children: [
                            {
                                text: 'Other Lymphocytic Leukemia',
                                id: '35013',
                                children: [],
                                path: [
                                  "35013",
                                  "35041-35043",
                                  "35011-35043",
                                  "0"
                                ]
                            },
                            {
                                text: 'Acute Monocytic Leukemia',
                                id: '35031',
                                children: [],
                                path: [
                                  "35031",
                                  "35041-35043",
                                  "35011-35043",
                                  "0"
                                ]
                            },
                            {
                                text: 'Other Acute Leukemia',
                                id: '35041',
                                children: [],
                                path: [
                                  "35041",
                                  "35041-35043",
                                  "35011-35043",
                                  "0"
                                ]
                            },
                            {
                                text: 'Aleukemic, Subleukemic and NOS',
                                id: '35043',
                                children: [],
                                path: [
                                  "35043",
                                  "35041-35043",
                                  "35011-35043",
                                  "0"
                                ]
                            },
                            {
                                text: 'Other Myeloid/Monocytic Leukemia',
                                id: '35023',
                                children: [],
                                path: [
                                  "35023",
                                  "35041-35043",
                                  "35011-35043",
                                  "0"
                                ]
                            }
                        ],
                        path: [
                          "35041-35043",
                          "35011-35043",
                          "0"
                        ]
                    }
                ],
                path: [
                  "35011-35043",
                  "0"
                ]
            },
            {
                text: 'Mesothelioma',
                id: '36010',
                children: [],
                path: [
                  "36010",
                  "0"
                ]
            },
            {
                text: 'Kaposi Sarcoma',
                id: '36020',
                children: [],
                path: [
                  "36020",
                  "0"
                ]
            },
            {
                text: 'Miscellaneous',
                id: '37000',
                children: [],
                path: [
                  "37000",
                  "0"
                ]
            },
            {
                text: 'In situ breast cancer',
                id: 'Breast-InSitu',
                children: [
                    {
                        text: 'Female Breast, In Situ',
                        id: 'Breast-InSitu-Female',
                        children: [],
                        path: [
                          "Breast-InSitu-Female",
                          "Breast-InSitu"
                        ]
                    },
                    {
                        text: 'Female Breast, In Situ',
                        id: 'Male Breast, In Situ',
                        children: [],
                        path: [
                          "Breast-InSitu-Male",
                          "Breast-InSitu"
                        ]
                    }
                ],
                path: [
                  "Breast-InSitu"
                ]
            }
        ]
    }

    function getList () {
        return [
            {
                title: 'Oral Cavity and Pharynx',
                key: '20010-20100'
            },
            {
                title: 'Lip',
                key: '20010'
            },
            {
                title: 'Tongue',
                key: '20020'
            },
            {
                title: 'Salivary Gland',
                key: '20030'
            },
            {
                title: 'Floor of Mouth',
                key: '20040'
            },
            {
                title: 'Gum and Other Mouth',
                key: '20050'
            },
            {
                title: 'Nasopharynx',
                key: '20060'
            },
            {
                title: 'Tonsil',
                key: '20070'
            },
            {
                title: 'Oropharynx',
                key: '20080'
            },
            {
                title: 'Hypopharynx',
                key: '20090'
            },
            {
                title: 'Other Oral Cavity and Pharynx',
                key: '20100'
            },
            {
                title: 'Digestive System',
                key: '21010-21130'
            },
            {
                title: 'Esophagus',
                key: '21010'
            },
            {
                title: 'Stomach',
                key: '21020'
            },
            {
                title: 'Small Intestine',
                key: '21030'
            },
            {
                title: 'Colon and Rectum',
                key: '21041-21052'
            },
            {
                title: 'Colon excluding Rectum',
                key: '21041-21049'
            },
            {
                title: 'Cecum',
                key: '21041'
            },
            {
                title: 'Appendix',
                key: '21042'
            },
            {
                title: 'Ascending Colon',
                key: '21043'
            },
            {
                title: 'Hepatic Flexure',
                key: '21044'
            },
            {
                title: 'Transverse Colon',
                key: '21045'
            },
            {
                title: 'Splenic Flexure',
                key: '21046'
            },
            {
                title: 'Descending Colon',
                key: '21047'
            },
            {
                title: 'Sigmoid Colon',
                key: '21048'
            },
            {
                title: 'Large Intestine, NOS',
                key: '21049'
            },
            {
                title: 'Rectum and Rectosigmoid Junction',
                key: '21051-21052'
            },
            {
                title: 'Rectosigmoid Junction',
                key: '21051'
            },
            {
                title: 'Rectum',
                key: '21052'
            },
            {
                title: 'Anus, Anal Canal and Anorectum',
                key: '21060'
            },
            {
                title: 'Liver and Intrahepatic Bile Duc',
                key: '21071-21072'
            },
            {
                title: 'Liver',
                key: '21071'
            },
            {
                title: 'Intrahepatic Bile Duct',
                key: '21072'
            },
            {
                title: 'Gallbladder',
                key: '21080'
            },
            {
                title: 'Other Biliary',
                key: '21090'
            },
            {
                title: 'Pancreas',
                key: '21100'
            },
            {
                title: 'Retroperitoneum',
                key: '21110'
            },
            {
                title: 'Peritoneum, Omentum and Mesentery',
                key: '21120'
            },
            {
                title: 'Other Digestive Organs',
                key: '21130'
            },
            {
                title: 'Respiratory System',
                key: '22010-22060'
            },
            {
                title: 'Nose, Nasal Cavity and Middle Ear',
                key: '22010'
            },
            {
                title: 'Larynx',
                key: '22020'
            },
            {
                title: 'Lung and Bronchus',
                key: '22030'
            },
            {
                title: 'Pleura',
                key: '22050'
            },
            {
                title: 'Trachea, Mediastinum and Other Respiratory Organs',
                key: '22060'
            },
            {
                title: 'Bones and Joints',
                key: '23000'
            },
            {
                title: 'Soft Tissue including Heart',
                key: '24000'
            },
            {
                title: 'Skin excluding Basal and Squamous',
                key: '25010-25020'
            },
            {
                title: 'Melanoma of the Skin',
                key: '25010'
            },
            {
                title: 'Other Non-Epithelial Skin',
                key: '25020'
            },
            {
                title: 'Male and Female Breast',
                key: '26000'
            },
            {
                title: 'Female Breast',
                key: '26000-Female'
            },
            {
                title: 'Male Breast',
                key: '26000-Male'
            },
            {
                title: 'Female Genital System',
                key: '27010-27070'
            },
            {
                title: 'Cervix Uteri',
                key: '27010'
            },
            {
                title: 'Corpus Uteri',
                key: '27020'
            },
            {
                title: 'Uterus, NOS',
                key: '27030'
            },
            {
                title: 'Ovary',
                key: '27040'
            },
            {
                title: 'Vagina',
                key: '27050'
            },
            {
                title: 'Vulva',
                key: '27060'
            },
            {
                title: 'Other Female Genital Organs',
                key: '27070'
            },
            {
                title: 'Male Genital System',
                key: '28010-28040'
            },
            {
                title: 'Prostate',
                key: '28010'
            },
            {
                title: 'Testis',
                key: '28020'
            },
            {
                title: 'Penis',
                key: '28030'
            },
            {
                title: 'Other Male Genital Organs',
                key: '28040'
            },
            {
                title: 'Urinary System',
                key: '29010-29040'
            },
            {
                title: 'Urinary Bladder, invasive and in situ',
                key: '29010'
            },
            {
                title: 'Kidney and Renal Pelvis',
                key: '29020'
            },
            {
                title: 'Ureter',
                key: '29030'
            },
            {
                title: 'Other Urinary Organs',
                key: '29040'
            },
            {
                title: 'Eye and Orbit',
                key: '30000'
            },
            {
                title: 'Brain and Other Nervous System',
                key: '31010-31040'
            },
            {
                title: 'Brain',
                key: '31010'
            },
            {
                title: 'Cranial Nerves Other Nervous System',
                key: '31040'
            },
            {
                title: 'Endocrine System',
                key: '32010-32020'
            },
            {
                title: 'Thyroid',
                key: '32010'
            },
            {
                title: 'Other Endocrine including Thymus',
                key: '32020'
            },
            {
                title: 'Lymphomas',
                key: '33011-33042'
            },
            {
                title: 'Hodgkin Lymphoma',
                key: '33011-33012'
            },
            {
                title: 'Hodgkin - Nodal',
                key: '33011'
            },
            {
                title: 'Hodgkin - Extranodal',
                key: '33012'
            },
            {
                title: 'Non-Hodgkin Lymphoma',
                key: '33041-33042'
            },
            {
                title: 'NHL – Nodal',
                key: '33041'
            },
            {
                title: 'NHL – Extranodal',
                key: '33042'
            },
            {
                title: 'Myeloma',
                key: '34000'
            },
            {
                title: 'Leukemias',
                key: '35011-35043'
            },
            {
                title: 'Acute Lymphocytic Leukemia',
                key: '35011'
            },
            {
                title: 'Chronic Lymphocytic Leukemia',
                key: '35012'
            },
            {
                title: 'Acute Myeloid Leukemia',
                key: '35021'
            },
            {
                title: 'Chronic Myeloid Leukemia',
                key: '35022'
            },
            {
                title: 'Other Leukemias',
                key: '35041-35043'
            },
            {
                title: 'Other Lymphocytic Leukemia',
                key: '35013'
            },
            {
                title: 'Acute Monocytic Leukemia',
                key: '35031'
            },
            {
                title: 'Other Acute Leukemia',
                key: '35041'
            },
            {
                title: 'Aleukemic, Subleukemic and NOS',
                key: '35043'
            },
            {
                title: 'Other Myeloid/Monocytic Leukemia',
                key: '35023'
            },
            {
                title: 'Mesothelioma',
                key: '36010'
            },
            {
                title: 'Kaposi Sarcoma',
                key: '36020'
            },
            {
                title: 'Miscellaneous',
                key: '37000'
            },
            {
                title: 'In situ breast cancer',
                key: 'Breast-InSitu'
            },
            {
                title: 'Female Breast, In Situ',
                key: 'Breast-InSitu-Female'
            },
            {
                title: 'Female Breast, In Situ',
                key: 'Male Breast, In Situ'
            }
        ]
    }
}());
