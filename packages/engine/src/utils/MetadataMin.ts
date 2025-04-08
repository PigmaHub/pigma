import { Container } from "pixi.js";

export interface IMetadataMixin {
  metadata: Record<string, any>;
  initMetadata(): void;
  setMetadataItem(key: string, value: any): void;
  getMetadataItem: (key: string) => any;
  getMetadata: () => Record<string, any>;
  setMetadata: (metadata: Record<string, any>) => void;
}

export const MetadataMixin: Partial<Container> = {
  initMetadata() {
    if (!this.metadata) {
      this.metadata = {};
    }
  },
  setMetadataItem(key: string, value: any) {
    (this as Container).initMetadata();
    (this as Container).metadata[key] = value;
  },
  getMetadataItem(key: string) {
    (this as Container).initMetadata();
    return (this as Container).metadata[key];
  },
  getMetadata() {
    (this as Container).initMetadata();
    return (this as Container).metadata;
  },
  setMetadata(metadata: Record<string, any>) {
    (this as Container).initMetadata();
    (this as Container).metadata = metadata;
  },
};
