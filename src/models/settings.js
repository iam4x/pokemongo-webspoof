import { observable } from 'mobx'

export default {
  updateXcodeLocation: observable(false),
  addJitterToMoves: observable(true),
  speedLimit: observable(4), // ~40-25 km/h
  zoom: observable(17) // map zoom
}
