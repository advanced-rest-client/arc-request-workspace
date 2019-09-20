import { css } from 'lit-element';

export default css`
:host {
  display: block;
  position: relative;
  --anypoint-tabs-selection-bar-zindex: 1;
}

[hidden] {
  display: none !important;
}

.tabs-row {
  background-color: var(--arc-request-workspace-tabs-backgroud-color, rgba(0, 0, 0, 0.05));
  border-bottom: 1px var(--arc-request-workspace-tabs-border-color, #e5e5e5) solid;
  position: relative;
}

.tab-name {
  font-size: 13px;
  margin-right: 8px;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}

anypoint-tab.selected {
  background-color: var(--arc-request-workspace-tabs-selected-background-color, #fff);
}

anypoint-tab {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.tabs {
  color: var(--arc-request-workspace-tabs-color, rgba(0,0,0,0.87));
  position: relative;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

anypoint-tab {
  -webkit-user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  user-select: none;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

.close-icon {
  color: var(--arc-request-workspace-tabs-close-color, rgba(0, 0, 0, 0.78));
  border-radius: 50%;
  width: 14px !important;
  height: 14px !important;
}

.close-icon:hover {
  color: var(--arc-request-workspace-tabs-close-color-hover, rgba(255, 255, 255, 0.54));
  background-color: var(--arc-request-workspace-tabs-close-background-color-hover, #FF8A65);
}

.add-request-button {
  color: var(--arc-request-workspace-tabs-add-color, #616161);
  background-color: var(--arc-request-workspace-tabs-add-background-color);
  cursor: pointer;
  height: 48px;
  position: absolute;
  width: 48px;
}

paper-progress {
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  width: 100%;
  display: none;
}

:host([restoring]) paper-progress {
  display: block;
}

.context-menu-icon {
  color: var(--request-editor-context-menu-icon-color, var(--primary-color));
}

.dragging {
  background-color: var(--arc-request-workspace-tab-dragging-background-color, #fff !important);
  z-index: 1;
  box-shadow: var(--box-shadow-2dp);
  --anypoint-tab-ink: transparent !important;
}

.moving {
  position: relative;
  -webkit-transition: -webkit-transform 0.1s ease-in-out;
  transition: transform 0.1s ease-in-out;
}

bottom-sheet {
  width: var(--bottom-sheet-width, 100%);
  max-width: var(--bottom-sheet-max-width, 700px);
  /* This subtracts application header (default for all ARC apps) */
  max-height: var(--bottom-sheet-max-height, calc(100vh - 68px));
}

.drop-target {
  display: none;
}

:host([dragging]) .drop-target {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
  background-color: #fff;
  border: 4px var(--drop-file-importer-header-background-color, var(--primary-color)) solid;
}

.error-toast {
  background-color: var(--warning-primary-color, #FF7043);
  color: var(--warning-contrast-color, #fff);
}

.drop-pointer {
  position: absolute;
  left: 4px;
  color: #757575;
  width: 20px;
  height: 24px;
  font-size: 20px;
  top: 36px;
}

.drop-pointer::before {
  content: "⇧";
}

.icon {
  display: block;
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.icon svg {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
`;
