# Local Weather

> **Bug Bash Arena challenge** · Difficulty: **starter**

Correct local fixture selection, units, refresh, and empty states.

## Participant rules

1. Create a branch named `<your-github-username>/local-weather` from the supplied starter branch.
2. Investigate and fix the intentional bugs using small, well-described commits.
3. Do not remove tests, alter scoring configuration, or copy solutions from another participant.
4. Push your branch and open a pull request, or register the exact immutable commit SHA through the event submission process.
5. Your result is verified only by the organizer's independent test runner. A branch or pull request alone earns no points.

## Scoring

This challenge contains four independently verified fixes. The organizer dashboard displays only the public criterion labels and your result; private test implementations and answer keys are not distributed in this repository.

## Local setup

This starter is intentionally framework-neutral so it can be kept small and reliable during the event. Install the dependencies documented by the organizer for the published repository, then use the supplied application entry point and visible checks.

## Weather lookup

Enter an OpenWeatherMap API key in the app to search for current weather by city. The key is saved in this browser's local storage and is not sent anywhere except OpenWeatherMap. Weather results include an embedded OpenStreetMap view and a link to open the location directly on the map. Since this is a browser-only demo, the API key is visible to the browser and should not be used as a production secret.

## Submission details

Record the challenge ID `local-weather`, your verified GitHub username, branch, and exact 40-character commit SHA. Submit before the configured deadline (21 October 2026, 4:00 PM Asia/Kolkata). Review the event-wide participant instructions for resubmission and tie-break rules.

## Security and fairness

Do not put passwords, tokens, or personal data in commits. The organizer's local demo runner does not execute arbitrary participant code. Production results require an isolated judging worker.
