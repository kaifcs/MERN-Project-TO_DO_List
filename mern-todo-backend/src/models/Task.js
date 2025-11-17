import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Task title must be at most 200 characters']
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Help when converting to JSON
TaskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

const Task = mongoose.model('Task', TaskSchema);
export default Task;
