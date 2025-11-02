import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Pending', 'In Progress', 'Done'], default: 'Pending' },
  deadline: { type: Date }
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema);