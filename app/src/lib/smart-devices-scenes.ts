import type {
  SmartDeviceControlTarget,
  SmartDeviceGroup,
  SmartDevicePowerState,
  SmartDeviceScene,
  SmartDeviceSceneAction,
  SmartDevicesSnapshot,
} from "./smart-devices";

function createSceneAction({
  targetType,
  target,
  state,
}: {
  targetType: SmartDeviceControlTarget;
  target: SmartDeviceGroup;
  state: SmartDevicePowerState;
}): SmartDeviceSceneAction {
  return {
    id: `${targetType}:${target.id}:${state}`,
    targetType,
    targetId: target.id,
    targetName: target.friendlyName,
    zigbee2MqttEntity: target.zigbee2MqttEntity,
    state,
  };
}

function findGroup(snapshot: SmartDevicesSnapshot, id: string) {
  return snapshot.groups.find((group) => group.id === id);
}

function createGroupScene({
  snapshot,
  id,
  name,
  description,
  room,
  actions,
}: {
  snapshot: SmartDevicesSnapshot;
  id: string;
  name: string;
  description: string;
  room?: string;
  actions: Array<{ groupId: string; state: SmartDevicePowerState }>;
}): SmartDeviceScene {
  return {
    id,
    organizationSlug: snapshot.organizationSlug,
    name,
    description,
    room,
    enabled: true,
    actions: actions
      .map(({ groupId, state }) => {
        const group = findGroup(snapshot, groupId);
        if (!group) return undefined;

        return createSceneAction({
          targetType: "group",
          target: group,
          state,
        });
      })
      .filter((action): action is SmartDeviceSceneAction => Boolean(action)),
  };
}

export function getSmartDeviceScenes(snapshot: SmartDevicesSnapshot): SmartDeviceScene[] {
  return [
    createGroupScene({
      snapshot,
      id: "open",
      name: "Open",
      description: "Turn on the main venue lighting groups used for opening service.",
      room: "Multi-room",
      actions: [
        { groupId: "open-lights", state: "on" },
        { groupId: "bar-lights", state: "on" },
        { groupId: "front-window-lights", state: "on" },
      ],
    }),
    createGroupScene({
      snapshot,
      id: "close",
      name: "Close",
      description: "Shut off guest-facing lights while leaving close-down targets explicit.",
      room: "Multi-room",
      actions: [
        { groupId: "open-lights", state: "off" },
        { groupId: "front-window-lights", state: "off" },
        { groupId: "patio-lights", state: "off" },
        { groupId: "close-lights", state: "off" },
      ],
    }),
    createGroupScene({
      snapshot,
      id: "bar-service",
      name: "Bar Service",
      description: "Keep the bar and backbar lighting on for normal service.",
      room: "Bar",
      actions: [{ groupId: "bar-lights", state: "on" }],
    }),
    createGroupScene({
      snapshot,
      id: "dining-service",
      name: "Dining Service",
      description: "Set the dining room lights for seated service.",
      room: "Dining Room",
      actions: [{ groupId: "dining-room-lights", state: "on" }],
    }),
    createGroupScene({
      snapshot,
      id: "patio-off",
      name: "Patio Off",
      description: "Turn off patio lighting as a focused scene.",
      room: "Patio",
      actions: [{ groupId: "patio-lights", state: "off" }],
    }),
  ].filter((scene) => scene.actions.length > 0);
}
