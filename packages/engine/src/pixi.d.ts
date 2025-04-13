import { Container } from "pixi.js";
import { IMetadataMixin } from "./utils/MetadataMin";

declare module "pixi.js" {
  interface Container extends IMetadataMixin {}
}
