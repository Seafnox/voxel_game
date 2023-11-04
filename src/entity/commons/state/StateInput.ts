import {Vector3} from "three";
import {ActivityStatus} from "./ActivityStatus";

export interface StateInput {
  velocity: Vector3;
  activityStatus: ActivityStatus;
}
