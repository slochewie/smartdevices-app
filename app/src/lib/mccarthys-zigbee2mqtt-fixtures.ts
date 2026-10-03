import type {
  Zigbee2MqttDeviceDefinition,
  Zigbee2MqttDeviceState,
  Zigbee2MqttExposeFeature,
  Zigbee2MqttGroupDefinition,
} from "./smart-devices";

const onOffExpose: Zigbee2MqttExposeFeature = {
  type: "binary",
  name: "state",
  property: "state",
};
const brightnessExpose: Zigbee2MqttExposeFeature = {
  type: "numeric",
  name: "brightness",
  property: "brightness",
};
const colorTempExpose: Zigbee2MqttExposeFeature = {
  type: "numeric",
  name: "color_temp",
  property: "color_temp",
};
const colorExpose: Zigbee2MqttExposeFeature = {
  type: "composite",
  name: "color",
  property: "color",
  features: [
    { type: "numeric", name: "x", property: "color_x" },
    { type: "numeric", name: "y", property: "color_y" },
  ],
};

const dimmableLight = [onOffExpose, brightnessExpose];
const colorTemperatureLight = [onOffExpose, brightnessExpose, colorTempExpose];
const colorLight = [onOffExpose, brightnessExpose, colorTempExpose, colorExpose];
const switchLike = [onOffExpose];

type FixtureDefinition = {
  model: string;
  vendor: string;
  description: string;
  exposes: Zigbee2MqttExposeFeature[];
};

const catalog: Record<string, FixtureDefinition> = {
  "929002398602": {
    vendor: "Philips",
    model: "929002398602",
    description: "Hue white and color ambience lamp",
    exposes: colorLight,
  },
  "9290030518": {
    vendor: "Philips",
    model: "9290030518",
    description: "Hue white ambience lamp",
    exposes: colorTemperatureLight,
  },
  "9290024717": {
    vendor: "Philips",
    model: "9290024717",
    description: "Hue white and color ambience lamp",
    exposes: colorLight,
  },
  "9290022268": {
    vendor: "Philips",
    model: "9290022268",
    description: "Hue white ambience lamp",
    exposes: colorTemperatureLight,
  },
  "9290022267A": {
    vendor: "Philips",
    model: "9290022267A",
    description: "Hue white ambience lamp",
    exposes: colorTemperatureLight,
  },
  "9290019758": {
    vendor: "Philips",
    model: "9290019758",
    description: "Hue white lamp",
    exposes: dimmableLight,
  },
  "9290011370": {
    vendor: "Philips",
    model: "9290011370",
    description: "Hue white lamp",
    exposes: dimmableLight,
  },
  "1746730V7": {
    vendor: "Philips",
    model: "1746730V7",
    description: "Hue outdoor light fixture",
    exposes: colorTemperatureLight,
  },
  TS0503B: {
    vendor: "Tuya",
    model: "TS0503B",
    description: "RGB LED controller",
    exposes: colorLight,
  },
  S31ZB: {
    vendor: "SONOFF",
    model: "S31ZB",
    description: "Zigbee smart plug",
    exposes: switchLike,
  },
  LED2008G3: {
    vendor: "IKEA",
    model: "LED2008G3",
    description: "TRADFRI dimmable warm white lamp",
    exposes: dimmableLight,
  },
  AE_260: {
    vendor: "Aeotec",
    model: "AE_260",
    description: "Zigbee switch module",
    exposes: switchLike,
  },
  "8719514440937_8719514440999": {
    vendor: "Philips",
    model: "8719514440937_8719514440999",
    description: "Hue white and color ambience lamp",
    exposes: colorLight,
  },
};

type McCarthysFixture = {
  entity: string;
  model: keyof typeof catalog;
  ieeeAddress: string;
  room: string;
  state: "ON" | "OFF";
  availability?: "online" | "offline";
  lastSeen: string;
};

const fixtures: McCarthysFixture[] = [
  {
    entity: "bar_pendant_1",
    model: "929002398602",
    ieeeAddress: "0x0017880101000001",
    room: "Bar",
    state: "ON",
    lastSeen: "1 minute ago",
  },
  {
    entity: "bar_pendant_2",
    model: "929002398602",
    ieeeAddress: "0x0017880101000002",
    room: "Bar",
    state: "ON",
    lastSeen: "1 minute ago",
  },
  {
    entity: "bar_pendant_3",
    model: "9290030518",
    ieeeAddress: "0x0017880101000003",
    room: "Bar",
    state: "ON",
    lastSeen: "2 minutes ago",
  },
  {
    entity: "backbar_strip_left",
    model: "TS0503B",
    ieeeAddress: "0xa4c1380101000004",
    room: "Bar",
    state: "ON",
    lastSeen: "1 minute ago",
  },
  {
    entity: "backbar_strip_right",
    model: "TS0503B",
    ieeeAddress: "0xa4c1380101000005",
    room: "Bar",
    state: "ON",
    lastSeen: "1 minute ago",
  },
  {
    entity: "front_window_lamp_1",
    model: "9290024717",
    ieeeAddress: "0x0017880101000006",
    room: "Front Window",
    state: "ON",
    lastSeen: "3 minutes ago",
  },
  {
    entity: "front_window_lamp_2",
    model: "9290024717",
    ieeeAddress: "0x0017880101000007",
    room: "Front Window",
    state: "ON",
    lastSeen: "3 minutes ago",
  },
  {
    entity: "dining_room_lamp_1",
    model: "9290022268",
    ieeeAddress: "0x0017880101000008",
    room: "Dining Room",
    state: "ON",
    lastSeen: "4 minutes ago",
  },
  {
    entity: "dining_room_lamp_2",
    model: "9290022268",
    ieeeAddress: "0x0017880101000009",
    room: "Dining Room",
    state: "ON",
    lastSeen: "4 minutes ago",
  },
  {
    entity: "dining_room_lamp_3",
    model: "9290022267A",
    ieeeAddress: "0x0017880101000010",
    room: "Dining Room",
    state: "ON",
    lastSeen: "4 minutes ago",
  },
  {
    entity: "snug_lamp_1",
    model: "9290019758",
    ieeeAddress: "0x0017880101000011",
    room: "Snug",
    state: "OFF",
    lastSeen: "6 minutes ago",
  },
  {
    entity: "snug_lamp_2",
    model: "9290011370",
    ieeeAddress: "0x0017880101000012",
    room: "Snug",
    state: "OFF",
    lastSeen: "6 minutes ago",
  },
  {
    entity: "patio_sconce_1",
    model: "1746730V7",
    ieeeAddress: "0x0017880101000013",
    room: "Patio",
    state: "OFF",
    availability: "offline",
    lastSeen: "47 minutes ago",
  },
  {
    entity: "patio_sconce_2",
    model: "1746730V7",
    ieeeAddress: "0x0017880101000014",
    room: "Patio",
    state: "OFF",
    lastSeen: "8 minutes ago",
  },
  {
    entity: "kitchen_pass_bulb",
    model: "LED2008G3",
    ieeeAddress: "0x8471270101000015",
    room: "Kitchen Pass",
    state: "ON",
    lastSeen: "2 minutes ago",
  },
  {
    entity: "office_lamp",
    model: "8719514440937_8719514440999",
    ieeeAddress: "0x0017880101000016",
    room: "Office",
    state: "OFF",
    lastSeen: "9 minutes ago",
  },
  {
    entity: "christmas_tree_plug",
    model: "S31ZB",
    ieeeAddress: "0x00124b0101000017",
    room: "Dining Room",
    state: "OFF",
    lastSeen: "5 minutes ago",
  },
  {
    entity: "neon_sign_plug",
    model: "S31ZB",
    ieeeAddress: "0x00124b0101000018",
    room: "Bar",
    state: "ON",
    lastSeen: "2 minutes ago",
  },
  {
    entity: "patio_string_lights_switch",
    model: "AE_260",
    ieeeAddress: "0x8cf6810101000019",
    room: "Patio",
    state: "OFF",
    lastSeen: "12 minutes ago",
  },
];

function createDeviceDefinition(fixture: McCarthysFixture): Zigbee2MqttDeviceDefinition {
  const definition = catalog[fixture.model];

  return {
    ieee_address: fixture.ieeeAddress,
    friendly_name: fixture.entity,
    definition: {
      vendor: definition.vendor,
      model: definition.model,
      description: definition.description,
      exposes: definition.exposes,
    },
    interview_completed: true,
  };
}

function createDeviceState(fixture: McCarthysFixture): Zigbee2MqttDeviceState {
  return {
    availability: fixture.availability ?? "online",
    state: fixture.state,
    room: fixture.room,
    lastSeen: fixture.lastSeen,
  };
}

function group(
  id: number,
  friendlyName: string,
  memberEntities: string[],
): Zigbee2MqttGroupDefinition {
  return {
    id,
    friendly_name: friendlyName,
    members: memberEntities.map((entity) => {
      const fixture = fixtures.find((candidate) => candidate.entity === entity);
      return {
        friendly_name: entity,
        ieee_address: fixture?.ieeeAddress,
      };
    }),
  };
}

export const mccarthysDeviceDefinitions = fixtures.map(createDeviceDefinition);

export const mccarthysGroupDefinitions: Zigbee2MqttGroupDefinition[] = [
  group(1, "bar_lights", [
    "bar_pendant_1",
    "bar_pendant_2",
    "bar_pendant_3",
    "backbar_strip_left",
    "backbar_strip_right",
    "neon_sign_plug",
  ]),
  group(2, "dining_room_lights", [
    "dining_room_lamp_1",
    "dining_room_lamp_2",
    "dining_room_lamp_3",
    "christmas_tree_plug",
  ]),
  group(3, "front_window_lights", ["front_window_lamp_1", "front_window_lamp_2"]),
  group(4, "patio_lights", [
    "patio_sconce_1",
    "patio_sconce_2",
    "patio_string_lights_switch",
  ]),
  group(5, "open_lights", [
    "bar_pendant_1",
    "bar_pendant_2",
    "bar_pendant_3",
    "backbar_strip_left",
    "backbar_strip_right",
    "front_window_lamp_1",
    "front_window_lamp_2",
    "dining_room_lamp_1",
    "dining_room_lamp_2",
    "dining_room_lamp_3",
    "kitchen_pass_bulb",
    "neon_sign_plug",
  ]),
  group(6, "close_lights", [
    "snug_lamp_1",
    "snug_lamp_2",
    "office_lamp",
    "christmas_tree_plug",
  ]),
];

export const mccarthysEntityStates: Record<string, Zigbee2MqttDeviceState> = Object.fromEntries(
  fixtures.map((fixture) => [fixture.entity, createDeviceState(fixture)]),
);

Object.assign(mccarthysEntityStates, {
  bar_lights: { state: "ON", room: "Bar" },
  dining_room_lights: { state: "ON", room: "Dining Room" },
  front_window_lights: { state: "ON", room: "Front Window" },
  patio_lights: { state: "OFF", room: "Patio" },
  open_lights: { state: "ON" },
  close_lights: { state: "OFF" },
});
