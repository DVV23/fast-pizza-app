import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart } from "../cart/cartSlice";
import { getTotalCartPrice } from "../cart/cartSlice";
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice";
import Button from "../../ui/Button";
import store from "./../../store";
import EmptyCart from "../cart/EmptyCart";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();
  const dispatch = useDispatch();
  /**
   * Returns the nearest ancestor Route error, which could be a loader/action
   * error or a render error.  This is intended to be called from your
   * ErrorBoundary/errorElement to display a proper error message.
   */

  const cart = useSelector(getCart);
  const cartPrice = useSelector(getTotalCartPrice);
  const priority = withPriority ? cartPrice * 0.2 : 0;
  const totalCartPrice = cartPrice + priority;
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);
  const isLoadingAddress = addressStatus === "loading";
  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      <Form method="POST" className="mx-2">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name:</label>
          <div>
            <input
              className="input grow"
              type="text"
              name="customer"
              placeholder="First name"
              required
              defaultValue={username}
            />
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number:</label>
          <div className="grow">
            <input
              className="input w-full"
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
            />
            {formErrors?.phone && (
              <p className="mt-2 rounded bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address:</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              required
              placeholder="Put you address"
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longtitude && (
            <span className="absolute right-[3px] z-50">
              <Button
                disabled={isLoadingAddress}
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                GET POSITION
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="m-2 h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longtitude
                ? `${position.latitude}, ${position.longtitude}`
                : ""
            }
          />
          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? "Placing order"
              : `Order now for ${formatCurrency(totalCartPrice)}$`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  //form handlers like handlesumbit
  const formData = await request.formData();
  const data = Object.fromEntries(formData); // make data Object from formData response.
  //these 2 line of codes is a pattern which we will always use
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };
  //making order as an object from all information
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone = "Please provide a valid phone number";
  if (Object.keys(errors).length > 0) return errors;
  //If everything is okay, create a new order and redirect to order page
  const newOrder = await createOrder(order);

  store.dispatch(clearCart()); // we implement store right directly in function, because we can not useDispatch inside function.
  //We can not over use this method, because its a trick how to use dispatch in fuction.

  return redirect(`/order/${newOrder.id}`);
  //use redirect instead of navigate = useNavigate, because we can not use Hook inside a function
}

export default CreateOrder;
