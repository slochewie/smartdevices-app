import type {
  SmartDeviceMqttPublishRequest,
  SmartDevicesMqttConfig,
  SmartDevicesMqttPublishResult,
  SmartDevicesMqttPublishStatus,
} from "./smart-devices";

const MQTT_PUBLISH_DRY_RUN_MESSAGE =
  "MQTT publish boundary is dry-run only. Live broker publish is not wired yet.";
const MQTT_PUBLISH_NOT_CONFIGURED_MESSAGE =
  "MQTT publish skipped because this organization does not have a broker configured.";

type PublishInput = {
  config: SmartDevicesMqttConfig;
  request: SmartDeviceMqttPublishRequest;
};

function createPublishResult({
  request,
  status,
  message,
}: {
  request: SmartDeviceMqttPublishRequest;
  status: SmartDevicesMqttPublishStatus;
  message: string;
}): SmartDevicesMqttPublishResult {
  const publishedAt = new Date().toISOString();

  return {
    id: `${status}:${request.topic}:${publishedAt}`,
    organizationSlug: request.organizationSlug,
    status,
    message,
    request,
    publishedAt,
  };
}

export function publishSmartDevicesMqttRequest({
  config,
  request,
}: PublishInput): SmartDevicesMqttPublishResult {
  if (!config.brokerUrl || config.status === "not-configured") {
    return createPublishResult({
      request,
      status: "not-configured",
      message: MQTT_PUBLISH_NOT_CONFIGURED_MESSAGE,
    });
  }

  return createPublishResult({
    request,
    status: "dry-run",
    message: MQTT_PUBLISH_DRY_RUN_MESSAGE,
  });
}
