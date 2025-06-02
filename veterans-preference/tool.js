// Veterans' Preference Interactive Tool Logic
(function() {
    'use strict';

    // State management
    const state = {
        currentQuestionId: null,
        history: [],
        answers: {},
        totalSteps: 0,
        currentStep: 0
    };

    // Decision tree structure
    const vetPreferenceTree = {
        'START': {
            id: 'START',
            questionText: 'Are you seeking information about Veterans\' Preference for yourself or someone else?',
            answers: [
                {
                    answerText: 'For myself (I am a veteran or current service member)',
                    nextQuestionId: 'VETERAN_STATUS'
                },
                {
                    answerText: 'For a family member',
                    nextQuestionId: 'FAMILY_RELATIONSHIP'
                },
                {
                    answerText: 'I am an HR professional seeking general information',
                    resultOutcome: {
                        type: 'info',
                        title: 'HR Professional Resources',
                        description: 'As an HR professional, you have access to comprehensive resources.',
                        additionalInfo: [
                            'Review the complete OPM Vet Guide for HR Professionals',
                            'Consult agency-specific policies',
                            'Contact OPM for specific case guidance'
                        ],
                        opmLinks: [
                            {
                                text: 'OPM Vet Guide for HR Professionals',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/'
                            }
                        ]
                    }
                }
            ]
        },

        'VETERAN_STATUS': {
            id: 'VETERAN_STATUS',
            questionText: 'What is your current military service status?',
            answers: [
                {
                    answerText: 'Discharged/Separated veteran',
                    nextQuestionId: 'DISCHARGE_TYPE'
                },
                {
                    answerText: 'Current active duty service member',
                    nextQuestionId: 'ACTIVE_DUTY_STATUS'
                },
                {
                    answerText: 'Retired military',
                    nextQuestionId: 'RETIREMENT_TYPE'
                },
                {
                    answerText: 'Current Reserve or National Guard member',
                    nextQuestionId: 'RESERVE_STATUS'
                }
            ]
        },

        'DISCHARGE_TYPE': {
            id: 'DISCHARGE_TYPE',
            questionText: 'What type of discharge did you receive from military service?',
            helpText: 'Your discharge characterization is shown on your DD-214 or equivalent discharge documentation.',
            answers: [
                {
                    answerText: "Honorable or General (and I specifically want to check for Sole Survivorship Preference first)",
                    nextQuestionId: "SSP_DATE_CHECK"
                },
                {
                    answerText: 'Honorable',
                    nextQuestionId: 'SERVICE_DATES'
                },
                {
                    answerText: 'General (Under Honorable Conditions)',
                    nextQuestionId: 'SERVICE_DATES'
                },
                {
                    answerText: 'Other Than Honorable (OTH)',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Veterans\' Preference',
                        description: 'Veterans\' Preference requires an honorable or general discharge.',
                        additionalInfo: [
                            'You may be able to upgrade your discharge through a military discharge review board',
                            'Some VA benefits may still be available depending on the circumstances'
                        ],
                        opmLinks: [
                            {
                                text: 'Character of Discharge Requirements',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#discharge'
                            }
                        ]
                    }
                },
                {
                    answerText: 'Bad Conduct or Dishonorable',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Veterans\' Preference',
                        description: 'Veterans\' Preference is not available with a bad conduct or dishonorable discharge.',
                        additionalInfo: [
                            'Discharge upgrades may be possible in limited circumstances',
                            'Consult with a Veterans Service Organization for assistance'
                        ]
                    }
                },
                {
                    answerText: 'Uncharacterized or Entry Level Separation',
                    nextQuestionId: 'ENTRY_LEVEL_SERVICE'
                }
            ]
        },

        'SERVICE_DATES': {
            id: 'SERVICE_DATES',
            questionText: 'When did you serve on active duty?',
            helpText: 'Select all periods that apply to your service.',
            multiSelect: true,
            answers: [
                {
                    answerText: 'During a war, campaign, or expedition',
                    nextQuestionId: 'DISABILITY_STATUS'
                },
                {
                    answerText: 'Served at least 180 consecutive days, any part after 9/11/80',
                    nextQuestionId: 'DISABILITY_STATUS'
                },
                {
                    answerText: 'Only during peacetime before 9/11/80',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Veterans\' Preference',
                        description: 'Peacetime service before September 11, 1980 does not qualify for Veterans\' Preference unless you have a service-connected disability.',
                        additionalInfo: [
                            'You may qualify if you have a service-connected disability',
                            'Consider applying for VA disability compensation if you have service-related conditions'
                        ]
                    }
                },
                {
                    answerText: 'Gulf War (8/2/90 to 1/2/92)',
                    nextQuestionId: 'DISABILITY_STATUS'
                },
                {
                    answerText: 'Operation Enduring Freedom/Operation Iraqi Freedom',
                    nextQuestionId: 'DISABILITY_STATUS'
                }
            ]
        },

        'DISABILITY_STATUS': {
            id: 'DISABILITY_STATUS',
            questionText: 'Do you have a service-connected disability?',
            helpText: 'A service-connected disability is one that the VA has determined was caused or aggravated by your military service.',
            answers: [
                {
                    answerText: 'Yes, rated 30% or more',
                    nextQuestionId: 'DISABILITY_TYPE_30'
                },
                {
                    answerText: 'Yes, rated 10% or more but less than 30%',
                    resultOutcome: {
                        type: 'eligible-10-point',
                        title: '10-Point Preference Eligible (CP)',
                        description: 'You appear to be eligible for 10-point compensable preference.',
                        requiredDocuments: [
                            'DD-214 or equivalent discharge documentation',
                            'VA letter showing disability percentage',
                            'SF-15 Application for 10-Point Veteran Preference'
                        ],
                        opmLinks: [
                            {
                                text: '10-Point Preference Information',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#10point'
                            }
                        ]
                    }
                },
                {
                    answerText: 'Yes, but less than 10%',
                    resultOutcome: {
                        type: 'eligible-5-point',
                        title: '5-Point Preference Eligible (TP)',
                        description: 'You appear to be eligible for 5-point preference based on your military service.',
                        requiredDocuments: [
                            'DD-214 or equivalent discharge documentation'
                        ],
                        opmLinks: [
                            {
                                text: '5-Point Preference Information',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#5point'
                            }
                        ]
                    }
                },
                {
                    answerText: 'No service-connected disability',
                    resultOutcome: {
                        type: 'eligible-5-point',
                        title: '5-Point Preference Eligible (TP)',
                        description: 'Based on your qualifying military service, you appear to be eligible for 5-point preference.',
                        requiredDocuments: [
                            'DD-214 or equivalent discharge documentation'
                        ],
                        opmLinks: [
                            {
                                text: '5-Point Preference Information',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#5point'
                            }
                        ]
                    }
                },
                {
                    answerText: 'Purple Heart recipient',
                    resultOutcome: {
                        type: 'eligible-10-point',
                        title: '10-Point Preference Eligible (CPS)',
                        description: 'As a Purple Heart recipient, you are eligible for 10-point preference.',
                        requiredDocuments: [
                            'DD-214 showing Purple Heart award',
                            'SF-15 Application for 10-Point Veteran Preference'
                        ],
                        opmLinks: [
                            {
                                text: '10-Point Preference for Purple Heart',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#purpleheart'
                            }
                        ]
                    }
                }
            ]
        },

        'FAMILY_RELATIONSHIP': {
            id: 'FAMILY_RELATIONSHIP',
            questionText: 'What is your relationship to the veteran?',
            helpText: 'Certain family members may be eligible for "derivative preference" based on the veteran\'s service.',
            answers: [
                {
                    answerText: 'Spouse',
                    nextQuestionId: 'SPOUSE_ELIGIBILITY'
                },
                {
                    answerText: 'Mother',
                    nextQuestionId: 'MOTHER_ELIGIBILITY'
                },
                {
                    answerText: 'Child',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Derivative Preference',
                        description: 'Children of veterans are not eligible for derivative preference. Only spouses and mothers of certain veterans qualify.',
                        additionalInfo: [
                            'The veteran themselves may be eligible for preference',
                            'Other veteran family benefits may be available through VA'
                        ]
                    }
                },
                {
                    answerText: 'Other family member',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Derivative Preference',
                        description: 'Only spouses and mothers of certain disabled or deceased veterans are eligible for derivative preference.',
                        additionalInfo: [
                            'The veteran themselves should apply for their own preference',
                            'Check with VA for other family member benefits'
                        ]
                    }
                }
            ]
        },

        'SPOUSE_ELIGIBILITY': {
            id: 'SPOUSE_ELIGIBILITY',
            questionText: 'What is the veteran\'s current status?',
            helpText: 'Spouses may be eligible for derivative preference under specific circumstances.',
            answers: [
                {
                    answerText: 'Living veteran with 100% service-connected disability',
                    nextQuestionId: 'SPOUSE_UNEMPLOYABILITY'
                },
                {
                    answerText: 'Deceased veteran (died in service or from service-connected disability during qualifying periods/campaigns OR was 100% P&T disabled at time of death)',
                    resultOutcome: {
                        type: 'eligible-10-point-derivative',
                        title: '10-Point Derivative Preference Eligible (XP - Widow/Widower)',
                        description: 'As the unremarried spouse of a qualifying deceased veteran, you may be eligible for 10-point derivative preference.',
                        requiredDocuments: [
                            'Marriage certificate',
                            'Veteran\'s DD-214 (or equivalent)',
                            'Veteran\'s death certificate',
                            'Documentation showing death was service-connected OR veteran was 100% P&T disabled (e.g., VA letter)',
                            'SF-15 Application for 10-Point Veteran Preference'
                        ],
                        additionalInfo: [
                            'You generally remain eligible unless you remarry (some exceptions apply).',
                            'The veteran must have served during specific periods or campaigns if death was not in service or due to service-connection.'
                        ],
                        opmLinks: [
                            {
                                text: 'Derivative Preference Information',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#derivative'
                            }
                        ]
                    }
                },
                {
                    answerText: 'Living veteran with less than 100% disability, or veteran\'s death was not service-connected and they were not 100% disabled.',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Derivative Preference as Spouse',
                        description: 'Spouses of living veterans are generally eligible only if the veteran has a 100% permanent and total service-connected disability and is unemployable. For deceased veterans, specific conditions regarding their service or cause of death must be met.',
                        additionalInfo: [
                            'The veteran themselves may be eligible for preference.',
                            'Check if the veteran\'s disability rating may increase or if other conditions for derivative preference apply.'
                        ]
                    }
                },
                {
                    answerText: 'Veteran is Missing in Action (MIA), captured, or forcibly detained by a foreign power.',
                    resultOutcome: {
                        type: 'eligible-10-point-derivative', // This is complex but often treated as XP
                        title: 'Potential 10-Point Derivative Preference (XP - Spouse of MIA/Captured)',
                        description: 'As the spouse of a service member in MIA/Captured status, you may be eligible for 10-point preference.',
                        requiredDocuments: [
                            'Marriage certificate',
                            'Official documentation of MIA/Captured status (e.g., from DoD)',
                            'SF-15 Application for 10-Point Veteran Preference'
                        ],
                        additionalInfo: [
                            'This is a special category of derivative preference.',
                            'Consult with HR or a Veterans Service Officer for detailed guidance.'
                        ],
                        opmLinks: [
                            {
                                text: 'Derivative Preference Information',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#derivative'
                            }
                        ]
                    }
                }
            ]
        },

        'ACTIVE_DUTY_STATUS': {
            id: 'ACTIVE_DUTY_STATUS',
            questionText: 'Are you expected to be discharged or released from active duty service under honorable conditions within the next 120 days?',
            answers: [
                {
                    answerText: 'Yes, and I can provide a certification.',
                    resultOutcome: {
                        type: 'info', // VOW Act provides early consideration, actual preference type depends on underlying eligibility
                        title: 'Potential Eligibility under VOW Act',
                        description: 'Under the VOW to Hire Heroes Act, you may receive early consideration for federal jobs. Your actual preference type (0, 5, or 10 points) will depend on your full service record once discharged.',
                        requiredDocuments: [
                            'Certification from the armed forces (letterhead, service dates, expected discharge/release date, character of service)',
                            'Upon separation, obtain DD-214 and SF-15 (if claiming 10-point preference)'
                        ],
                        additionalInfo: [
                            'Agencies must accept your certification in lieu of a DD-214 for application purposes.',
                            'You will need to provide your DD-214 to finalize preference before appointment.',
                            'Consider your likely eligibility based on service dates and any disability to determine if you\'d be 0-point SSP, 5-point, or 10-point eligible.'
                        ],
                        opmLinks: [
                            { text: 'VOW Act Information (within Vet Guide)', url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/' } // Placeholder, needs specific link if available
                        ]
                        // Consider linking to SERVICE_DATES or DISABILITY_STATUS for self-assessment of underlying preference.
                    }
                },
                {
                    answerText: 'No, I am not within 120 days of separation OR I cannot provide certification.',
                    resultOutcome: {
                        type: 'info',
                        title: 'Re-assess When Eligible',
                        description: 'To be considered under the VOW Act, you need to be within 120 days of separation and provide a certification. Otherwise, you generally need your DD-214 to claim preference after separation.',
                        additionalInfo: [
                            'Check back when you are within 120 days of your expected separation date.',
                            'Ensure you request a certification letter from your command well in advance.'
                        ]
                    }
                },
                {
                    answerText: 'I am on terminal leave.',
                    resultOutcome: {
                        type: 'info', // Similar to VOW Act, can apply, preference type depends on underlying eligibility
                        title: 'Eligible to Apply While on Terminal Leave',
                        description: 'Service members on terminal leave can apply for federal jobs and may receive preference. Your actual preference type (0, 5, or 10 points) will depend on your full service record.',
                        requiredDocuments: [
                            'Official documentation of terminal leave status and expected honorable discharge date.',
                            'DD-214 upon final separation.',
                            'SF-15 (if claiming 10-point preference) upon separation.'
                        ],
                        additionalInfo: [
                            'This allows you to start the job search process before your official separation date.',
                            'Consider your likely eligibility based on service dates and any disability to determine if you\'d be 0-point SSP, 5-point, or 10-point eligible.'
                        ]
                    }
                }
            ]
        },

        'RETIREMENT_TYPE': {
            id: 'RETIREMENT_TYPE',
            questionText: 'Regarding your military retirement, which of these is true?',
            answers: [
                {
                    answerText: 'Retired at rank of Major, Lieutenant Commander, or higher AND retirement was NOT due to a service-connected disability.',
                    resultOutcome: {
                        type: 'not-eligible-unless-disabled', // Special type to indicate conditional eligibility
                        title: 'Generally Not Eligible for Preference in Appointment (Retired Senior Officer)',
                        description: 'Military retirees at the rank of Major, Lieutenant Commander, or higher are generally not eligible for preference in appointments unless they are disabled veterans.',
                        additionalInfo: [
                            'If you have a service-connected disability, you may still be eligible for preference. You can restart this tool and indicate your disability status.',
                            'This restriction does not apply to preference in Reduction in Force (RIF) if you meet other RIF preference criteria.'
                        ],
                        // Option to loop to DISABILITY_STATUS or restart:
                        // nextQuestionId: 'DISABILITY_STATUS' // Or provide a button to restart and choose disabled path
                    }
                },
                {
                    answerText: 'Retired at rank below Major, Lieutenant Commander, OR retired at a higher rank DUE to a service-connected disability.',
                    nextQuestionId: 'SERVICE_DATES' // Proceed to determine underlying preference based on service
                },
                {
                    answerText: 'Receiving retired pay as a Reservist at age 60 (or will be).',
                    nextQuestionId: 'SERVICE_DATES' // Generally treated like other retirees for preference, underlying service determines type.
                }
            ]
        },

        'RESERVE_STATUS': {
            id: 'RESERVE_STATUS',
            questionText: 'As a current Reserve or National Guard member, have you been called to active duty (not for training) under Title 10 or Title 32 orders for a period that would qualify you for preference (e.g., during a war/campaign, or for more than 180 consecutive days, etc.)?',
            answers: [
                {
                    answerText: 'Yes, and I have been discharged from that period of active duty under honorable conditions.',
                    nextQuestionId: 'DISCHARGE_TYPE' // Evaluate that specific period of service
                },
                {
                    answerText: 'Yes, I am currently on such active duty.',
                    nextQuestionId: 'ACTIVE_DUTY_STATUS' // Refer to active duty rules (VOW Act, etc.)
                },
                {
                    answerText: 'No, my active duty was only for training OR I haven\'t had qualifying active service periods.',
                    resultOutcome: {
                        type: 'info',
                        title: 'Preference Based on Qualifying Active Duty',
                        description: 'Generally, active duty for training as a Reservist/Guard member does not confer preference unless you incurred a service-connected disability during that training or were activated under specific Title 10/32 authorities for qualifying periods (e.g., war, campaign, >180 days non-training).',
                        additionalInfo: [
                            'If you have other prior periods of qualifying active service as a veteran (not Reserve/Guard training), restart the tool and use that service.',
                            'If you incurred a disability during training, you might be eligible for 10-point preference. Restart and select the disability path.',
                            'Otherwise, you may not be eligible for preference at this time based on Reserve/Guard service alone.'
                        ]
                    }
                }
            ]
        },

        'ENTRY_LEVEL_SERVICE': {
            id: 'ENTRY_LEVEL_SERVICE',
            questionText: "Was your 'Uncharacterized' or 'Entry Level Separation' (ELS) due to a service-connected disability incurred during your brief period of service?",
            answers: [
                {
                    answerText: 'Yes.',
                    resultOutcome: {
                        type: 'complex',
                        title: 'Potentially Eligible - Complex Case (ELS with Disability)',
                        description: 'Eligibility in this case is complex. An Entry Level Separation due to a service-connected disability incurred during that service might qualify you for 10-point preference.',
                        requiredDocuments: [
                            'DD-214 or equivalent separation document.',
                            'SF-15 Application for 10-Point Veteran Preference.',
                            'Official documentation of the service-connected disability and its incurrence during your service (e.g., VA rating decision, military medical records).'
                        ],
                        additionalInfo: [
                            'This is a less common scenario and requires clear documentation.',
                            'Be prepared to provide detailed evidence to the hiring agency.',
                            'Consult with HR or a Veterans Service Officer for guidance.'
                        ],
                        opmLinks: [
                             { text: 'Character of Discharge (Vet Guide)', url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/' } // Placeholder
                        ]
                    }
                },
                {
                    answerText: 'No.',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Generally Not Eligible (ELS without Disability)',
                        description: "Uncharacterized or Entry Level Separations generally do not qualify for Veterans' Preference unless proven to be due to a service-connected disability incurred during that service period.",
                        additionalInfo: [
                            'If you believe a disability was incurred, you would need to pursue a claim with the VA and obtain documentation.'
                        ]
                    }
                }
            ]
        },

        'DISABILITY_TYPE_30': { // This node follows 'Yes, rated 30% or more' from DISABILITY_STATUS
            id: 'DISABILITY_TYPE_30',
            questionText: 'Is your service-connected disability rated by the VA as 30% or more?', // This is a confirmation step
            answers: [
                {
                    answerText: 'Yes, 30% or more.', // Confirms path for CPS
                    resultOutcome: {
                        type: 'eligible-10-point-cps',
                        title: '10-Point Preference Eligible (CPS - 30% or More Disabled)',
                        description: 'You appear to be eligible for 10-point (CPS) preference due to a service-connected disability rated at 30% or more.',
                        requiredDocuments: [
                            'DD-214 or equivalent discharge documentation',
                            'VA letter confirming current disability rating of 30% or more',
                            'SF-15 Application for 10-Point Veteran Preference'
                        ],
                        opmLinks: [
                            {
                                text: '10-Point Preference (CPS)',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#10point' // General 10-point link
                            }
                        ]
                    }
                }
                // No "No" answer here as the previous question already established 30% or more.
                // If there was a need to distinguish permanent vs. temporary 30%+, more questions would be needed.
                // For now, this directly leads to CPS. XP (disability) without 30% is handled by other paths.
            ]
        },

        'MOTHER_ELIGIBILITY': {
            id: 'MOTHER_ELIGIBILITY',
            questionText: 'Regarding the veteran (your child), which of these applies?',
            answers: [
                {
                    answerText: 'My veteran child died under honorable conditions while on active duty during a war, qualifying campaign/expedition, or specific peacetime periods OR is 100% permanently and totally disabled due to service.',
                    nextQuestionId: 'MOTHER_MARITAL_STATUS'
                },
                {
                    answerText: 'None of the above apply to my veteran child.',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Derivative Preference as Mother',
                        description: 'To be eligible as a mother, your veteran child must have died under specific conditions (e.g., in service during wartime/campaign, or from service-connected causes if 100% P&T disabled) or be currently living with a 100% permanent and total service-connected disability.',
                        opmLinks: [
                            { text: 'Derivative Preference for Mothers', url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#derivative' }
                        ]
                    }
                }
            ]
        },

        'MOTHER_MARITAL_STATUS': {
            id: 'MOTHER_MARITAL_STATUS',
            questionText: 'What is your current marital status and living situation related to the veteran\'s father or your current husband?',
            answers: [
                { // Combines several conditions from OPM guide for simplicity
                    answerText: 'I am widowed (from veteran\'s father or subsequent marriage) and have not remarried; OR I am divorced/separated from the veteran\'s father and have not remarried; OR I am married and living with my husband (veteran\'s father or remarried) who is totally and permanently disabled.',
                    resultOutcome: {
                        type: 'eligible-10-point-derivative',
                        title: '10-Point Derivative Preference Eligible (Mother - XP)',
                        description: 'Based on your veteran child\'s service/disability and your current status, you may be eligible for 10-point derivative preference as a mother.',
                        requiredDocuments: [
                            'Your birth certificate (showing relationship to veteran, if name changed documentation of that too)',
                            'Veteran\'s DD-214 (or equivalent)',
                            'Veteran\'s death certificate (if applicable) or VA letter confirming 100% P&T disability',
                            'Documentation of your marital status (e.g., marriage cert, divorce decree, husband\'s death cert)',
                            'If applicable, documentation of husband\'s total and permanent disability',
                            'SF-15 Application for 10-Point Veteran Preference'
                        ],
                        opmLinks: [
                            { text: 'Derivative Preference for Mothers', url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#derivative' }
                        ]
                    }
                },
                {
                    answerText: 'None of the above accurately describe my situation.',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Derivative Preference as Mother',
                        description: 'Your current marital or living situation, based on the OPM guidelines, does not appear to meet the specific requirements for derivative preference as a mother.',
                        opmLinks: [
                            { text: 'Derivative Preference for Mothers', url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#derivative' }
                        ]
                    }
                }
            ]
        },

        'SPOUSE_UNEMPLOYABILITY': { // Follow-up to SPOUSE_ELIGIBILITY for "Living veteran with 100% service-connected disability"
            id: 'SPOUSE_UNEMPLOYABILITY',
            questionText: 'Is the living veteran, due to their 100% service-connected disability, unable to work in their usual occupation?',
            answers: [
                {
                    answerText: 'Yes, they are unable to work in their usual occupation due to the disability.',
                    resultOutcome: {
                        type: 'eligible-10-point-derivative',
                        title: '10-Point Derivative Preference Eligible (Spouse - XP)',
                        description: 'As the spouse of a living veteran who is 100% service-connected disabled and unable to work in their usual occupation due to that disability, you may be eligible for 10-point derivative preference.',
                        requiredDocuments: [
                            'Marriage certificate',
                            'Veteran\'s DD-214 (or equivalent)',
                            'VA letter confirming veteran\'s 100% permanent and total service-connected disability',
                            'Evidence the veteran is unable to work in their usual occupation due to the disability (e.g., VA rating of individual unemployability, or other documentation specified by OPM/agency)',
                            'SF-15 Application for 10-Point Veteran Preference'
                        ],
                        opmLinks: [
                             { text: 'Derivative Preference for Spouses', url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#derivative' }
                        ]
                    }
                },
                {
                    answerText: 'No, they are still able to work OR their inability to work is not due to the service-connected disability.',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Derivative Preference as Spouse',
                        description: 'To be eligible as a spouse of a living 100% disabled veteran, the veteran must be unable to work in their usual occupation specifically because of the service-connected disability.',
                        opmLinks: [
                             { text: 'Derivative Preference for Spouses', url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#derivative' }
                        ]
                    }
                }
            ]
        }
        // Additional nodes would continue here...

        // SSP Outcome Definition
        sspEligibleOutcome: {
            type: "info-0-point", // May need a new CSS class for distinct styling if desired
            title: "0-Point Sole Survivorship Preference (SSP) Potentially Eligible",
            description: "Based on your responses, you may be eligible for 0-point Sole Survivorship Preference (SSP). This preference does not add points to your score but provides other significant advantages in federal hiring.",
            additionalInfo: [
                "You are entitled to be listed ahead of non-preference eligibles with the same examination score or in the same quality category.",
                "You have the same pass-over rights as other preference eligibles.",
                "Your experience in the armed forces can be credited towards meeting qualification requirements for Federal jobs.",
                "Eligibility requires discharge/release after August 29, 2008, due to a sole survivorship discharge."
            ],
            requiredDocuments: [
                "DD Form 214 (Certificate of Release or Discharge from Active Duty) that indicates a sole survivorship discharge.",
                "SF-15, Application for 10-Point Veteran Preference (While SSP is 0-point, this form is often used to formally claim any veteran preference status; follow agency instructions).",
                "If requested by the agency, documentation related to the qualifying family member's service and status."
            ],
            opmLinks: [
                { text: "OPM Vet Guide - Types of Preference (see 0-point SSP)", url: "https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/" }
            ]
        },

        // SSP Path Starts Here
        SSP_DATE_CHECK: {
            id: 'SSP_DATE_CHECK',
            questionText: "Was your discharge or release from active duty on or after August 29, 2008?",
            answers: [
                {
                    answerText: 'Yes',
                    nextQuestionId: 'SSP_REASON_CHECK'
                },
                {
                    answerText: 'No',
                    nextQuestionId: 'SERVICE_DATES' // If too early for SSP, proceed to check other preference types
                }
            ]
        },

        SSP_REASON_CHECK: {
            id: 'SSP_REASON_CHECK',
            questionText: "Was the reason for this discharge specifically a 'sole survivorship discharge'?",
            helpText: "This type of discharge is granted if you are the only surviving child in a family where a parent or sibling(s) served in the armed forces and suffered certain casualties (e.g., death, MIA, 100% disability).",
            answers: [
                {
                    answerText: 'Yes',
                    resultOutcome: 'sspEligibleOutcome' // Reference the defined outcome
                },
                {
                    answerText: 'No',
                    nextQuestionId: 'SERVICE_DATES' // If not an SSP discharge, proceed to check other preference types
                }
            ]
        }
    };

    // DOM elements
    let elements = {};

    // Initialize the tool
    function init() {
        // Get DOM elements
        elements = {
            disclaimer: document.querySelector('.tool-disclaimer'),
            acceptButton: document.getElementById('accept-disclaimer'),
            toolInterface: document.getElementById('tool-interface'),
            questionArea: document.getElementById('question-area'),
            answersArea: document.getElementById('answers-area'),
            resultArea: document.getElementById('result-area'),
            progressBar: document.querySelector('.progress-bar'),
            currentStep: document.getElementById('current-step'),
            totalSteps: document.getElementById('total-steps'),
            backButton: document.getElementById('back-button'),
            restartButton: document.getElementById('restart-button'),
            printButton: document.getElementById('print-button')
        };

        // Set up event listeners
        if (elements.acceptButton) {
            elements.acceptButton.addEventListener('click', startTool);
        }

        if (elements.restartButton) {
            elements.restartButton.addEventListener('click', restartTool);
        }

        if (elements.backButton) {
            elements.backButton.addEventListener('click', goBack);
        }

        if (elements.printButton) {
            elements.printButton.addEventListener('click', printResults);
        }

        // Calculate total steps
        state.totalSteps = countTotalSteps();
        if (elements.totalSteps) {
            elements.totalSteps.textContent = state.totalSteps;
        }
    }

    // Count total possible steps in the tree
    function countTotalSteps() {
        // Updated approximation after adding new nodes. Max depth could be around 5-7 in complex paths.
        // This is still an estimate for UI display.
        return 17; // Increased from 10, then by 2 for SSP_DATE_CHECK and SSP_REASON_CHECK
    }

    // Start the tool after accepting disclaimer
    function startTool() {
        elements.disclaimer.style.display = 'none';
        elements.toolInterface.style.display = 'block';
        displayQuestion('START');
    }

    // Display a question
    function displayQuestion(questionId) {
        const question = vetPreferenceTree[questionId];
        if (!question) {
            console.error('Question not found:', questionId);
            return;
        }

        // Update state
        state.currentQuestionId = questionId;
        state.currentStep = Math.min(state.currentStep + 1, state.totalSteps);

        // Update progress
        updateProgress();

        // Clear previous content
        elements.questionArea.innerHTML = '';
        elements.answersArea.innerHTML = '';
        elements.resultArea.style.display = 'none';

        // Display question
        const questionHTML = `
            <h2>${question.questionText}</h2>
            ${question.helpText ? `<p class="help-text">${question.helpText}</p>` : ''}
        `;
        elements.questionArea.innerHTML = questionHTML;

        // Display answers
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-option';
            button.textContent = answer.answerText;
            button.setAttribute('data-answer-index', index);
            button.addEventListener('click', () => handleAnswer(answer));
            elements.answersArea.appendChild(button);
        });

        // Update navigation
        elements.backButton.style.display = state.history.length > 0 ? 'inline-block' : 'none';
    }

    // Handle answer selection
    function handleAnswer(answer) {
        // Save answer
        state.answers[state.currentQuestionId] = answer.answerText;
        state.history.push(state.currentQuestionId);

        if (answer.nextQuestionId) {
            displayQuestion(answer.nextQuestionId);
        } else if (answer.resultOutcome) {
            // Check if resultOutcome is a string ID (like for SSP) or an object
            if (typeof answer.resultOutcome === 'string') {
                displayResult(vetPreferenceTree[answer.resultOutcome]);
            } else {
                displayResult(answer.resultOutcome);
            }
        }
    }

    // Display result
    function displayResult(result) {
        if (!result) {
            console.error('Result object is undefined. Current state:', state, 'Triggering answer:', state.answers[state.currentQuestionId]);
            // Display a generic error to the user
            elements.resultArea.innerHTML = `<h2>Error</h2><p>An unexpected error occurred. Please restart the tool.</p>`;
            elements.resultArea.style.display = 'block';
            elements.questionArea.style.display = 'none';
            elements.answersArea.style.display = 'none';
            elements.printButton.style.display = 'inline-block';
            elements.backButton.style.display = 'none';
            return;
        }
        elements.questionArea.style.display = 'none';
        elements.answersArea.style.display = 'none';
        elements.resultArea.style.display = 'block';

        // Apply result type styling
        elements.resultArea.className = `tool-result ${result.type}`;

        // Build result HTML
        let resultHTML = `
            <h2>${result.title}</h2>
            <p>${result.description}</p>
        `;

        if (result.requiredDocuments && result.requiredDocuments.length > 0) {
            resultHTML += `
                <div class="result-documents">
                    <h3>Required Documents:</h3>
                    <ul>
                        ${result.requiredDocuments.map(doc => `<li>${doc}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        if (result.additionalInfo && result.additionalInfo.length > 0) {
            resultHTML += `
                <div class="result-details">
                    <h3>Additional Information:</h3>
                    <ul>
                        ${result.additionalInfo.map(info => `<li>${info}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        if (result.opmLinks && result.opmLinks.length > 0) {
            resultHTML += `
                <div class="result-links">
                    <h3>Official Resources:</h3>
                    <ul>
                        ${result.opmLinks.map(link =>
                            `<li><a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.text}</a></li>`
                        ).join('')}
                    </ul>
                </div>
            `;
        }

        elements.resultArea.innerHTML = resultHTML;
        elements.printButton.style.display = 'inline-block';
        elements.backButton.style.display = 'none';

        // Update progress to 100%
        state.currentStep = state.totalSteps;
        updateProgress();
    }

    // Update progress bar
    function updateProgress() {
        const progress = (state.currentStep / state.totalSteps) * 100;
        elements.progressBar.style.width = `${progress}%`;
        elements.currentStep.textContent = state.currentStep;

        // Update ARIA attributes
        const progressContainer = document.querySelector('.tool-progress');
        if (progressContainer) {
            progressContainer.setAttribute('aria-valuenow', progress);
        }
    }

    // Go back to previous question
    function goBack() {
        if (state.history.length > 0) {
            state.history.pop(); // Remove current
            const previousId = state.history.length > 0 ? state.history[state.history.length - 1] : 'START';
            state.currentStep = Math.max(1, state.currentStep - 2); // Adjust for re-display
            displayQuestion(previousId);
        }
    }

    // Restart the tool
    function restartTool() {
        // Reset state
        state.currentQuestionId = null;
        state.history = [];
        state.answers = {};
        state.currentStep = 0;

        // Reset UI
        elements.questionArea.style.display = 'block';
        elements.answersArea.style.display = 'block';
        elements.resultArea.style.display = 'none';
        elements.printButton.style.display = 'none';

        // Start over
        displayQuestion('START');
    }

    // Print results
    function printResults() {
        window.print();
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);

})();
