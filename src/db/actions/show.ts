import { ShowModel } from "../models";
import dbConnect from "../mongoose";

export async function getShows() {
  await dbConnect();
  return await ShowModel.find();
}

export async function getShowById(id: string) {
  await dbConnect();
  return await ShowModel.findById(id);
}

export async function createShow(name: string) {
  await dbConnect();
  return await ShowModel.create({ name, seasons: [] });
}

export async function updateShow(id: string, name: string) {
  await dbConnect();
  return await ShowModel.findByIdAndUpdate(id, { name }, { new: true });
}

export async function deleteShow(id: string) {
  await dbConnect();
  return await ShowModel.findByIdAndDelete(id);
}
