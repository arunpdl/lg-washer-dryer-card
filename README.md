![112699616-35751b00-8e5a-11eb-9bf8-cc09af4847a9](https://user-images.githubusercontent.com/2007088/219449339-a4ee4d38-c8d2-45b9-96c0-0c4ad1325cb0.PNG)
![138618307-c7b6a9f0-073e-44df-a70a-8c0acbcb033b](https://user-images.githubusercontent.com/2007088/219449465-211f7ba4-1b8d-4262-8b84-d91e2aa4fd36.png)
![LG Fridge Card](docs/images/fridge.png)


This repo is for Home Assistant users who want cards that look like their LG ThinQ enabled machines physical displays. You'll need the LG ThinQ integration already installed.

This repo currently contains cards for LG Washers and Dryers.

Known supported/tested models:
Washer/Dryer: This card is expected to apply pretty widely to any/all LG ThinQ washers and dryers. The implementation from the ThinQ integration is quite standardised.

# Installation

1. Ensure you have HACS (Home Assistant Community Store) installed.
2. In HACS, go to "Frontend" and click the three dots in the top right to add a "Custom repository".
3. Use the URL of this GitHub repository and select "Lovelace" as the category.
4. Click "Add", then find the "LG ThinQ Cards" entry and click "Install".
5. HACS will ask you to add the resource to your Lovelace configuration. Click "Add to Lovelace".

# Configuration
1. Go to your desired Lovelace dashboard and click "Add Card".
2. Search for "LG Washer Card" or "LG Dryer Card" and select it.
3. Use the visual editor to select the entities from your LG ThinQ integration.
    - **Entity**: The main sensor for your machine (e.g., `sensor.washer`).
    - **Run State Entity**: The sensor that shows the current state (e.g., `sensor.washer_run_state`).
    - **Door Lock Entity** (for washer): The sensor that shows the door lock status (e.g., `sensor.washer_door_lock`).
4. Click "Save".

There is no longer any need to modify `configuration.yaml` or manually add resources.

# Notes
7segment font (c) Jan Bobrowski (OFL) - http://torinak.com/7segment

---
*This integration was converted to be HACS-compatible with assistance from a Google AI.*
