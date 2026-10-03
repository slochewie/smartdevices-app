import { createFileRoute } from "@tanstack/react-router";
import { SmartDevicesPage } from "#/components/smart-devices-page";
import { createSmartDevicesOrganizationContext } from "#/lib/organization-context";
import { submitSmartDeviceCommand } from "#/lib/smart-devices-command-execution";
import { getSmartDevicesMqttConfig } from "#/lib/smart-devices-mqtt-config";
import { getSmartDeviceScenes } from "#/lib/smart-devices-scenes";
import { getSmartDevicesSnapshot } from "#/lib/smart-devices-snapshot";
import type { SmartDeviceScene } from "#/lib/smart-devices";
import { formatMqttPayloadPreview } from "#/lib/zigbee2mqtt-publish";

export const Route = createFileRoute("/$organizationSlug/scenes")({
  component: ScenesRoute,
});

function getSceneStatus(scene: SmartDeviceScene) {
  if (!scene.enabled) return "disabled";
  return "ready";
}

function ScenesRoute() {
  const { organizationSlug } = Route.useParams();
  const organization = createSmartDevicesOrganizationContext(organizationSlug);
  const snapshot = getSmartDevicesSnapshot(organization.slug);
  const mqttConfig = getSmartDevicesMqttConfig(organization.slug);
  const scenes = getSmartDeviceScenes(snapshot);
  const actionCount = scenes.reduce((count, scene) => count + scene.actions.length, 0);

  return (
    <>
      <SmartDevicesPage
        organization={organization}
        pageId="scenes"
        fallbackLabel="Scenes"
        fallbackIcon="shield-check"
      >
        Saved lighting looks and operating modes built from the current
        Zigbee2MQTT group inventory. Scene execution is dry-run until the live
        MQTT publisher is wired.
      </SmartDevicesPage>

      <section className="summary-grid" aria-label="Scene summary">
        <article className="summary-card">
          <span>Total scenes</span>
          <strong>{scenes.length}</strong>
        </article>
        <article className="summary-card">
          <span>Enabled</span>
          <strong>{scenes.filter((scene) => scene.enabled).length}</strong>
        </article>
        <article className="summary-card">
          <span>Actions</span>
          <strong>{actionCount}</strong>
        </article>
      </section>

      <section className="data-grid" aria-label="Smart Device scenes">
        {scenes.map((scene) => {
          const status = getSceneStatus(scene);

          return (
            <article className="data-card data-card--compact" key={scene.id}>
              <div className="data-card__header">
                <div>
                  <p className="data-card__eyebrow">{scene.room ?? "Multi-room"}</p>
                  <h3>{scene.name}</h3>
                </div>
                <span className="status-pill" data-status={scene.enabled ? "on" : "off"}>
                  {status}
                </span>
              </div>

              <p className="page-card__description">{scene.description}</p>

              <div className="device-card__quick">
                <span>{scene.actions.length} actions</span>
                <span>dry-run</span>
              </div>

              <details className="mqtt-details">
                <summary>Scene actions</summary>
                <dl className="data-list">
                  {scene.actions.map((action) => (
                    <div key={action.id}>
                      <dt>{action.targetName}</dt>
                      <dd>
                        {action.targetType} · {action.state} · {action.zigbee2MqttEntity}
                      </dd>
                    </div>
                  ))}
                </dl>
              </details>

              <div className="command-bar" aria-label={`${scene.name} dry-run actions`}>
                {scene.actions.map((action) => {
                  const result = submitSmartDeviceCommand(
                    {
                      id: `scene:${scene.id}:${action.id}`,
                      organizationSlug: scene.organizationSlug,
                      targetType: action.targetType,
                      targetId: action.targetId,
                      zigbee2MqttEntity: action.zigbee2MqttEntity,
                      command: action.state === "on" ? "turn-on" : "turn-off",
                      payload: { state: action.state },
                      enabled: false,
                      disabledReason: "Scene MQTT publish is not wired yet.",
                    },
                    mqttConfig,
                  );

                  return (
                    <button
                      key={action.id}
                      type="button"
                      className="command-button"
                      disabled
                      title={`${result.message} ${result.publishRequest.topic} ${formatMqttPayloadPreview(
                        result.publishRequest,
                      )}`}
                    >
                      <span>
                        {action.state === "on" ? "Turn on" : "Turn off"} {action.targetName}
                      </span>
                      <code>{formatMqttPayloadPreview(result.publishRequest)}</code>
                      <small>{result.status}</small>
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
