import OutCall "http-outcalls/outcall";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";

actor {
  type CartItem = {
    productId : Text;
    variantId : Text;
    quantity : Nat;
  };

  type CustomerInfo = {
    name : Text;
    email : Text;
    address : Text;
  };

  type Order = {
    orderId : Text;
    customerInfo : CustomerInfo;
    items : [CartItem];
    totalAmount : Nat;
  };

  let carts = Map.empty<Principal, [CartItem]>();
  let orders = Map.empty<Text, Order>();

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func generateKey(caller : Principal) : Principal {
    caller;
  };

  func generateOrderId(customerInfo : CustomerInfo) : Text {
    customerInfo.email # customerInfo.name;
  };

  // Cart management
  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    let cartKey = generateKey(caller);
    let currentCart = switch (carts.get(cartKey)) {
      case (null) { [] };
      case (?cart) { cart };
    };

    let existingItemIndex = currentCart.findIndex(func(ci) { ci.productId == item.productId and ci.variantId == item.variantId });

    let newCart = switch (existingItemIndex) {
      case (null) { currentCart.concat([item]) };
      case (?index) {
        Array.tabulate(
          currentCart.size(),
          func(i) {
            if (i == index) {
              { productId = item.productId; variantId = item.variantId; quantity = currentCart[i].quantity + item.quantity };
            } else {
              currentCart[i];
            };
          },
        );
      };
    };
    carts.add(cartKey, newCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Text, variantId : Text) : async () {
    let cartKey = generateKey(caller);
    let currentCart = switch (carts.get(cartKey)) {
      case (null) { [] };
      case (?cart) { cart };
    };

    let newCart = currentCart.filter(func(item) { not (item.productId == productId and item.variantId == variantId) });
    carts.add(cartKey, newCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    switch (carts.get(generateKey(caller))) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    carts.remove(generateKey(caller));
  };

  // Order processing
  public shared ({ caller }) func placeOrder(customerInfo : CustomerInfo, totalAmount : Nat) : async Text {
    let cartKey = generateKey(caller);
    let cartItems = switch (carts.get(cartKey)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) { cart };
    };

    let orderId = generateOrderId(customerInfo);
    let order : Order = {
      orderId;
      customerInfo;
      items = cartItems;
      totalAmount;
    };
    orders.add(orderId, order);
    carts.remove(cartKey);
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Text) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    let ordersIter = orders.values();
    let ordersArray = ordersIter.toArray();
    ordersArray;
  };

  // Product data fetching
  public func fetchAliExpressProduct(url : Text) : async Text {
    await OutCall.httpGetRequest(url, [], transform);
  };
};
