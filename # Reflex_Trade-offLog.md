git# Reflex — Trade-off Log

This document records the key design trade-offs made in the Reflex build, why each decision was accepted, and what could be improved with more development time.

## 1. Manual Rider Assignment

**Trade-off:**
The dispatcher manually assigns a rider to each delivery request instead of the system automatically assigning riders.

**Acceptable because:**
Manual assignment keeps the system simple and allows the build to focus on the core workflow: creating a delivery, assigning a rider, and tracking its status within the sprint timeline.

**With more time:**
Implement automatic rider assignment based on rider availability, location, current workload, and delivery priority.

---

## 2. Limited Offline Support

**Trade-off:**
Riders need an active internet connection to receive delivery details and update delivery status.

**Acceptable because:**
The current design focuses on demonstrating the main online delivery workflow end-to-end within the available development time.

**With more time:**
Add offline functionality so riders can view assigned deliveries and update statuses without connectivity, with changes synchronized automatically when the connection is restored.

---

## 3. Basic Delivery Status Flow

**Trade-off:**
The delivery currently follows a simple status sequence:

**Assigned → Picked Up → Delivered**

**Acceptable because:**
This simple flow is sufficient to demonstrate the core delivery process without adding unnecessary complexity to the prototype.

**With more time:**
Add additional statuses such as **Cancelled, Failed Delivery, Returned,** and **Delivery Attempted**.

---

## Summary

These trade-offs were intentional decisions made to keep the prototype focused on the core delivery workflow. With additional development time, the system could improve automation, reliability, and delivery-state coverage.
