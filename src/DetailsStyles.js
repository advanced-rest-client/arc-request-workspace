import { css } from 'lit-element';

export default css`
:host {
  display: block;
  color: var(--arc-workspace-detail-color, inherit);
  background-color: var(--arc-workspace-detail-background-color, inherit);
  padding: var(--arc-workspace-detail-padding);
  box-sizing: border-box;
  font-size: var(--arc-font-body1-font-size);
  font-weight: var(--arc-font-body1-font-weight);
  line-height: var(--arc-font-body1-line-height);
}

h2 {
  font-size: var(--arc-font-headline-font-size);
  font-weight: var(--arc-font-headline-font-weight);
  letter-spacing: var(--arc-font-headline-letter-spacing);
  line-height: var(--arc-font-headline-line-height);
}

.description {
  max-width: var(--arc-workspace-detail-description-max-width, 700px);
  color: var(--arc-workspace-detail-description-color, rgba(0, 0, 0, 0.64));
}

.meta-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--arc-workspace-detail-data-list-color, rgba(0, 0, 0, 0.87));
  height: 40px;
}

.meta-row .label {
  width: 160px;
}

.meta-row .value {
  white-space: var(--arc-font-nowrap-white-space);
  overflow: var(--arc-font-nowrap-overflow);
  text-overflow: var(--arc-font-nowrap-text-overflow);
}

.actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
}

.actions anypoint-button {
  padding-left: 12px;
  padding-right: 12px;
}

anypoint-button .icon {
  margin-right: 12px;
}

arc-marked {
  margin-top: 20px;
  padding: 0;
}

.empty {
  font-style: italic;
}

.icon {
  display: block;
  width: 24px;
  height: 24px;
  fill: currentColor;
}
`;
