// src/models/Counter.js
import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // tên counter, ví dụ: "userId"
  seq: { type: Number, default: 0 }      // giá trị hiện tại
});

const Counter = mongoose.model("Counter", CounterSchema);
export default Counter;