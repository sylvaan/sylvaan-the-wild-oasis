import styled from "styled-components";
import BookingDataBox from "../bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";

import { useBooking } from "../bookings/useBooking";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSettings } from "../settings/useSettings";
import { useCheckin } from "./useCheckin";
import { formatCurrency, isWithinCheckinWindow } from "../../utils/helpers";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const [confirmEarlyCheckin, setConfirmEarlyCheckin] = useState(false);

  const { booking, isLoading } = useBooking();
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const navigate = useNavigate();
  const { checkin, isCheckingIn } = useCheckin();

  useEffect(() => {
    // eslint-disable-next-line
    if (booking?.isPaid) setConfirmPaid(true);
  }, [booking?.isPaid]);

  if (isLoading || isLoadingSettings || !booking) return <Spinner />;

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
    startDate,
  } = booking;

  const canCheckin = isWithinCheckinWindow(startDate);

  const optionalBreakfastPrice =
    settings?.breakfastPrice * numNights * numGuests;

  function handleCheckin() {
    if (!confirmPaid) return;

    if (addBreakfast) {
      checkin({
        bookingId,
        breakfast: {
          hasBreakfast: true,
          extrasPrice: optionalBreakfastPrice,
          totalPrice: totalPrice + optionalBreakfastPrice,
        },
      });
    } else {
      checkin({
        bookingId,
        breakfast: {},
      });
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={() => navigate(-1)}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!canCheckin && (
        <Box>
          <p
            style={{
              color: "var(--color-red-700)",
              fontWeight: 500,
              marginBottom: "1.2rem",
            }}
          >
            ⚠️ Early check-in is only available starting at 08:00 AM on the day
            of arrival.
          </p>
          <Checkbox
            checked={confirmEarlyCheckin}
            onChange={() => setConfirmEarlyCheckin((confirm) => !confirm)}
            id="early-checkin"
          >
            I confirm that this is an approved early check-in (cabin is clean
            and ready).
          </Checkbox>
        </Box>
      )}

      {(canCheckin || confirmEarlyCheckin) && !hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast((add) => !add);
              setConfirmPaid(false);
            }}
            id="breakfast"
          >
            Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}?
          </Checkbox>
        </Box>
      )}

      {(canCheckin || confirmEarlyCheckin) && (
        <Box>
          <Checkbox
            checked={confirmPaid}
            onChange={() => setConfirmPaid((confirm) => !confirm)}
            disabled={confirmPaid || isCheckingIn}
            id="confirm"
          >
            I confirm that {guests.fullName} has paid the total amount of{" "}
            {!addBreakfast
              ? formatCurrency(totalPrice)
              : `${formatCurrency(
                  totalPrice + optionalBreakfastPrice
                )} (${formatCurrency(totalPrice)} + ${formatCurrency(
                  optionalBreakfastPrice
                )})`}
          </Checkbox>
        </Box>
      )}

      <ButtonGroup>
        {(canCheckin || confirmEarlyCheckin) && (
          <Button
            onClick={handleCheckin}
            disabled={!confirmPaid || isCheckingIn}
          >
            Check in booking #{bookingId}
          </Button>
        )}
        <Button variation="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
