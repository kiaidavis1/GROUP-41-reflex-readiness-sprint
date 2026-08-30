# Reflex — Demo Script

## Demo Objective

Demonstrate how Reflex manages a delivery from the initial request through rider assignment and delivery completion.

The demo follows the core workflow:

**Retailer → Dispatcher → Rider → Delivery Status**

---

## 1. Retailer Creates a Delivery Request

**Action:**
Log in or open the retailer interface and create a new delivery request.

**Enter:**

* Customer name
* Customer phone number
* Delivery address
* Item description

**Say:**
"The retailer starts the workflow by recording the delivery request with the customer's information and the item details."

**Expected result:**
A new delivery request is created and becomes available for the dispatcher.

---

## 2. Dispatcher Views the Request

**Action:**
Open the dispatcher interface and view the available delivery requests.

**Say:**
"The dispatcher can now see the open delivery request and is responsible for assigning it to a rider."

**Expected result:**
The newly created delivery appears in the dispatcher's list of open requests.

---

## 3. Dispatcher Assigns a Rider

**Action:**
Select the delivery and assign an available rider.

**Say:**
"The dispatcher assigns the delivery to a rider. In this version, rider assignment is manual because the prototype focuses on validating the core workflow."

**Expected result:**
The delivery is associated with the selected rider and its status becomes **Assigned**.

---

## 4. Rider Views the Assigned Delivery

**Action:**
Open the rider interface.

**Say:**
"The rider can now see the delivery that has been assigned to them."

**Expected result:**
The assigned delivery appears in the rider's delivery list.

---

## 5. Rider Picks Up the Order

**Action:**
Update the delivery status from:

**Assigned → Picked Up**

**Say:**
"After collecting the order, the rider updates the delivery status to Picked Up."

**Expected result:**
The delivery status changes to **Picked Up**.

---

## 6. Rider Completes the Delivery

**Action:**
Update the delivery status from:

**Picked Up → Delivered**

**Say:**
"Once the order reaches the customer, the rider marks the delivery as Delivered."

**Expected result:**
The delivery status changes to **Delivered**.

---

## 7. Retailer Checks the Final Status

**Action:**
Return to the retailer interface and view the delivery.

**Say:**
"The retailer can now see that the delivery has been completed instead of relying on WhatsApp or phone calls for an update."

**Expected result:**
The delivery shows the final status **Delivered**.

---

## Demo Closing

**Say:**
"This demonstrates the core Reflex workflow: the retailer creates a delivery request, the dispatcher assigns a rider, and the rider updates the delivery status through completion. The main value is improved visibility and coordination throughout the delivery process."
