import UnoGame from "./pages/UnoGame";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import 'setimmediate';
test("dealCards", async () => {
  render(<UnoGame />);
  const login = screen.getByTestId("login");
  const dealCardsButton = screen.getByTestId("deal");
  const handCardsContainer = screen.getByTestId("handCards");

  fireEvent.click(login);
  fireEvent.click(dealCardsButton);


  setTimeout(()=> {
    expect(handCardsContainer.children.length).toBe(7);
 }
 ,500);
  // Wait for the asynchronous operation to complete
});
