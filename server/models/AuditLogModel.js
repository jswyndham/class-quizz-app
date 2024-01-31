import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
	action: String, // e.g., "CREATE", "UPDATE", "DELETE"
	subjectType: String, // e.g., "Class", "Quiz"
	classId: mongoose.Schema.Types.ObjectId,
	userId: mongoose.Schema.Types.ObjectId, // ID of the user who performed the action
	details: Object, // Provide details about the action
	timestamp: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
export default AuditLog;
