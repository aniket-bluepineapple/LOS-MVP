from flask import Blueprint, request, jsonify
from datetime import datetime
from los.models import db, SystemNotification, User, LoanApplication

system_notification_bp = Blueprint("system_notification", __name__, url_prefix="/api/notifications")


# Create a new System Notification
@system_notification_bp.route("/", methods=["POST"])
def create_notification():
    data = request.json

    # Validate required fields
    required_fields = ["SenderID", "ReceiverID", "ApplicationID", "Message"]
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    # Validate User existence
    sender = User.query.get(data["SenderID"])
    receiver = User.query.get(data["ReceiverID"])
    if not sender or not receiver:
        return jsonify({"message": "Sender or Receiver not found"}), 404

    # Validate Loan Application existence
    application = LoanApplication.query.get(data["ApplicationID"])
    if not application:
        return jsonify({"message": "Loan Application not found"}), 404

    new_notification = SystemNotification(
        SenderID=data["SenderID"],
        ReceiverID=data["ReceiverID"],
        ApplicationID=data["ApplicationID"],
        Message=data["Message"],
        Timestamp=datetime.utcnow()
    )

    db.session.add(new_notification)
    db.session.commit()

    return jsonify({
        "message": "Notification sent successfully!",
        "notification": {
            "NotificationID": new_notification.NotificationID,
            "SenderID": new_notification.SenderID,
            "ReceiverID": new_notification.ReceiverID,
            "ApplicationID": new_notification.ApplicationID,
            "Message": new_notification.Message,
            "Timestamp": new_notification.Timestamp
        }
    }), 201


# Get all Notifications
@system_notification_bp.route("/", methods=["GET"])
def get_notifications():
    notifications = SystemNotification.query.all()
    return jsonify([
        {
            "NotificationID": n.NotificationID,
            "SenderID": n.SenderID,
            "ReceiverID": n.ReceiverID,
            "ApplicationID": n.ApplicationID,
            "Message": n.Message,
            "Timestamp": n.Timestamp
        }
        for n in notifications
    ])


# Get Notifications by ReceiverID
@system_notification_bp.route("/receiver/<int:receiver_id>", methods=["GET"])
def get_notifications_for_user(receiver_id):
    notifications = SystemNotification.query.filter_by(ReceiverID=receiver_id).all()
    if not notifications:
        return jsonify({"message": "No notifications found for this user"}), 404

    return jsonify([
        {
            "NotificationID": n.NotificationID,
            "SenderID": n.SenderID,
            "ReceiverID": n.ReceiverID,
            "ApplicationID": n.ApplicationID,
            "Message": n.Message,
            "Timestamp": n.Timestamp
        }
        for n in notifications
    ])


# Get a single Notification by ID
@system_notification_bp.route("/<int:notification_id>", methods=["GET"])
def get_notification(notification_id):
    notification = SystemNotification.query.get(notification_id)
    if not notification:
        return jsonify({"message": "Notification not found"}), 404

    return jsonify({
        "NotificationID": notification.NotificationID,
        "SenderID": notification.SenderID,
        "ReceiverID": notification.ReceiverID,
        "ApplicationID": notification.ApplicationID,
        "Message": notification.Message,
        "Timestamp": notification.Timestamp
    })


# Delete a Notification
@system_notification_bp.route("/<int:notification_id>", methods=["DELETE"])
def delete_notification(notification_id):
    notification = SystemNotification.query.get(notification_id)
    if not notification:
        return jsonify({"message": "Notification not found"}), 404

    db.session.delete(notification)
    db.session.commit()
    return jsonify({"message": "Notification deleted successfully!"})
