function determineEligibility() {
    const honorableDischarge = document.querySelector('input[name="honorableDischarge"]:checked');
    const vowAct = document.querySelector('input[name="vowAct"]:checked');
    const serviceConnectedDisability = document.querySelector('input[name="serviceConnectedDisability"]:checked');

    let resultText = "Please answer all initial questions to get a preliminary assessment.";
    let eligible = true; // Assume eligible until a disqualifying condition is met

    // --- Initial Checks ---
    if (!honorableDischarge) {
        resultText = "Please answer Question 1 regarding your discharge conditions.";
        document.getElementById('eligibilityResult').textContent = resultText;
        return;
    }

    if (honorableDischarge.value === 'no') {
        // If not honorable discharge, check VOW Act
        if (!vowAct) {
            resultText = "Since discharge was not honorable, please answer Question 2 regarding VOW Act applicability.";
            document.getElementById('eligibilityResult').textContent = resultText;
            return;
        }
        if (vowAct.value === 'no') {
            resultText = "Based on your answers, you likely do not meet the fundamental requirement of honorable discharge or VOW Act conditions for Veterans' Preference. Please refer to hrdocs.txt for full details.";
            eligible = false;
        } else {
            // VOW Act 'yes', so potentially eligible despite 'no' to standard discharge question (for now)
            // This means they are an active service member expecting honorable discharge.
             resultText = "As an active service member under VOW Act conditions, you may be eligible. Further questions will refine this.";
        }
    } else { // Honorable discharge is 'yes'
        resultText = "You meet the initial discharge requirement. ";
    }

    if (!eligible) {
        document.getElementById('eligibilityResult').textContent = resultText;
        return; // Stop further checks if fundamental requirements aren't met
    }

    // --- Disability Check (Basic) ---
    if (!serviceConnectedDisability) {
        resultText += "Please answer Question 3 regarding service-connected disability.";
        document.getElementById('eligibilityResult').textContent = resultText;
        return;
    }

    if (serviceConnectedDisability.value === 'yes') {
        resultText += "You indicated a service-connected disability. This may qualify you for 10-point preference. Further details would be needed to determine the specific type (CP, CPS, XP). ";
        // Placeholder: Add more questions here to differentiate CP, CPS, XP
        // For example: prompt for disability percentage, Purple Heart, etc.
    } else {
        resultText += "You did not indicate a service-connected disability. You might still be eligible for 0-point or 5-point preference based on service period or other criteria. ";
        // Placeholder: Add questions for service period, sole survivorship etc.
    }

    // --- Placeholder for further logic ---
    // This is where more detailed questions and logic based on hrdocs.txt will be added.
    // For example:
    // - Specific service period checks for 5-point preference.
    // - Sole survivorship discharge for 0-point preference.
    // - Derived preference for spouses, widows/widowers, mothers.
    // - Military retiree status.

    resultText += "\n\nRemember, this tool provides guidance only and is not an official determination.";

    document.getElementById('eligibilityResult').textContent = resultText;
}

// Ensure the function is available globally or attach it as an event listener
// The HTML currently uses onclick="determineEligibility()", so it needs to be global.
