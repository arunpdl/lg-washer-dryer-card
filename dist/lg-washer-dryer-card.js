const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);

const html = LitElement.prototype.html;

const getAssetPath = () => {
  const scripts = document.getElementsByTagName("script");
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.includes("lg-washer-dryer-card.js")) {
      return scripts[i].src.substring(0, scripts[i].src.lastIndexOf("/"));
    }
  }
  return "/hacsfiles/lg-washer-dryer-card"; // Fallback
};

const BASE_PATH = getAssetPath();


const css = LitElement.prototype.css || ((strings, ...values) => {
  const factory = document.createElement('style');
  factory.textContent = strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
  return factory.textContent;
});

const CARD_VERSION = '1.0.0';

console.info(
  `%c  LG-THINQ-CARDS \n%c  Version ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

const cssUrl = `${BASE_PATH}/7segment.css`;
if (!document.querySelector(`link[href="${cssUrl}"]`)) {
  const styleElement = document.createElement('link');
  styleElement.setAttribute('rel', 'stylesheet');
  styleElement.setAttribute('href', cssUrl);
  document.head.appendChild(styleElement);
}


class LGThinQBaseCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    if (!config.run_state_entity) {
      throw new Error("You need to define a run_state_entity");
    }
    this.config = JSON.parse(JSON.stringify(config));
  }

  getCardSize() {
    return 3;
  }

  render() {
    throw new Error("Render method must be implemented in child class");
  }

  _getFormattedTime(entity) {
    const runState = this.hass.states[this.config.run_state_entity]?.state;
    if (runState === '-' || runState === 'unavailable' || runState === 'Standby') {
      return '-:--';
    }
    const remainTime = this.hass.states[entity]?.attributes?.remaining_time;
    if (remainTime) {
      return remainTime.split(":").slice(0, 2).join(":");
    }
    return ' ';
  }

  _renderImage(icon, entity, state, top, left, width = '20%') {
    const stateImage = state ? `${icon}-on.png` : `${icon}.png`;
    return html`
      <img
        src="${BASE_PATH}/images/lg-icons/${stateImage}"
        style="
          top: ${top};
          left: ${left};
          width: ${width};
          position: absolute;
          image-rendering: crisp;
        "
      />
    `;
  }

  _renderTimeDisplay() {
    const time = this._getFormattedTime(this.config.entity);
    const commonStyle = `
    font-family: 'segment7';
    font-size: 55px;
    position: absolute;
    right: 55px;
    top: 50%;
    text-align: right;
    letter-spacing: 2px;
  `;
    return html`
    <div style="${commonStyle} color: rgba(255, 255, 255, 0.05); z-index: 1;">88:88</div>
    <div style="${commonStyle} color: #8df427; z-index: 2; text-shadow: 0 0 10px rgba(141, 244, 39, 0.5);">${time}</div>
  `;;
  }

  _renderDetails() {
    const runState = this.hass.states[this.config.run_state_entity]?.state;
    if (runState === '-' || runState === 'unavailable') {
      return html``;
    }

    const attributes = this.hass.states[this.config.entity]?.attributes;

    return html`
      <ha-card>
        <div class="card-content">
          ${this.config.details.map(detail => {
      return html`
              <div class="info-row">
                <ha-icon icon="${detail.icon}"></ha-icon>
                <div class="name">${detail.name}</div>
                <div class="state">${attributes[detail.attribute]}</div>
              </div>
            `;
    })}
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return LitElement.prototype.css`
    :host {
      display: block;
    }
    .main-container {
      position: relative;
      width: 100%;
      /* Adjust this ratio if your background image is a different shape */
      aspect-ratio: 2.34 / 1; 
      overflow: hidden;
      background-color: #1c1c1c; /* Matches the dark background */
    }
    .status-image {
      position: absolute;
      image-rendering: crisp-edges;
      image-rendering: pixelated;
      transition: opacity 0.3s ease-in-out;
    }
  `;
  }
}

class LGWasherCard extends LGThinQBaseCard {
  setConfig(config) {
    super.setConfig(config);
    if (!config.door_lock_entity) {
      throw new Error("You need to define a door_lock_entity");
    }
    this.config.details = [
      { name: "Current Course", attribute: "current_course", icon: "mdi:tune-vertical-variant" },
      { name: "Water Temperature", attribute: "water_temp", icon: "mdi:coolant-temperature" },
      { name: "Spin Speed", attribute: "spin_speed", icon: "mdi:rotate-right" },
    ];
  }

  render() {
    const runState = this.hass.states[this.config.run_state_entity]?.state;
    const mainEntity = this.hass.states[this.config.entity];
    const doorLock = this.hass.states[this.config.door_lock_entity];

    return html`
    <ha-card style="overflow: hidden;">
      <div style="position: relative; width: 100%; aspect-ratio: 2.3 / 1;">
        <img src="${BASE_PATH}/images/hass-combo-card-bg.png" style="width: 100%; display: block;" />
        
        ${this._renderImage('sensing', this.config.run_state_entity, runState === 'Detecting', '10%', '25%')}
        ${this._renderImage('wash', this.config.run_state_entity, runState === 'Washing', '10%', '44%')}
        ${this._renderImage('rinse', this.config.run_state_entity, runState === 'Rinsing', '10%', '62%')}
        ${this._renderImage('spin', this.config.run_state_entity, runState === 'Spinning', '10%', '78%')}
        
        ${this._renderImage('wifi', this.config.entity, mainEntity?.state === 'on', '62%', '32%', '8%')}
        ${this._renderImage('lock', this.config.door_lock_entity, doorLock?.state === 'on', '62%', '45%', '8%')}
        
        ${this._renderTimeDisplay()}
      </div>
      ${this._renderDetails()}
    </ha-card>
  `;
  }
}

customElements.define("lg-washer-card", LGWasherCard);

class LGDryerCard extends LGThinQBaseCard {
  setConfig(config) {
    super.setConfig(config);
    this.config.details = [
      { name: "Current Course", attribute: "current_course", icon: "mdi:tune-vertical-variant" },
      { name: "Temperature Control", attribute: "temp_control", icon: "mdi:thermometer" },
      { name: "Dry Level", attribute: "dry_level", icon: "mdi:air-filter" },
    ];
  }

  render() {
    const runState = this.hass.states[this.config.run_state_entity]?.state;
    const mainEntity = this.hass.states[this.config.entity];

    return html`
            <ha-card>
                <div style="position: relative;">
                    <img src="${BASE_PATH}/images/hass-dryer-card-bg.png" style="width: 100%;" />
                    ${this._renderImage('dry', this.config.run_state_entity, runState === 'Drying', '10%', '69%')}
                    ${this._renderImage('cool', this.config.run_state_entity, runState === 'Cooling', '10%', '87%')}
                    ${this._renderImage('wifi', this.config.entity, mainEntity?.state === 'on', '62%', '32%', '10%')}
                    ${this._renderTimeDisplay()}
                </div>
                ${this._renderDetails()}
            </ha-card>
        `;
  }
}

customElements.define("lg-dryer-card", LGDryerCard);


// Configuration UI for the cards

const cardTypes = {
  'washer': {
    name: 'LG Washer Card',
    description: 'A card for LG ThinQ Washing Machines.',
    preview: true,
    documentationURL: 'https://github.com/arunpdl/lg-washer-dryer-card',
    entities: ['entity', 'run_state_entity', 'door_lock_entity']
  },
  'dryer': {
    name: 'LG Dryer Card',
    description: 'A card for LG ThinQ Dryers.',
    preview: true,
    documentationURL: 'https://github.com/arunpdl/lg-washer-dryer-card',
    entities: ['entity', 'run_state_entity']
  }
};

for (const [type, config] of Object.entries(cardTypes)) {
  const editor = class extends LitElement {
    static get properties() {
      return { hass: {}, _config: {} };
    }

    setConfig(config) {
      this._config = config;
    }

    render() {
      if (!this.hass) return html``;

      return html`
                <div class="card-config">
                    ${config.entities.map(entityConf => {
        return html`
                            <ha-entity-picker
                                .label="${entityConf.replace('_', ' ')}"
                                .hass=${this.hass}
                                .value=${this._config[entityConf]}
                                .configValue=${entityConf}
                                @value-changed=${this._valueChanged}
                                allow-custom-entity
                            ></ha-entity-picker>
                        `;
      })}
                </div>
            `;
    }

    _valueChanged(ev) {
      if (!this._config || !this.hass) return;
      const { target } = ev;
      const newConfig = { ...this._config, [target.configValue]: target.value };
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig } }));
    }
  };

  customElements.define(`lg-${type}-card-editor`, editor);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: `lg-${type}-card`,
    name: config.name,
    description: config.description,
    preview: config.preview,
    documentationURL: config.documentationURL,
    editMode: `lg-${type}-card-editor`,
  });
}