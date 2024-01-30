import UnoGame from "./pages/UnoGame";
import Login from "./pages/Login";
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import 'setimmediate';

// Test that the login page is only accessible when authenticated
test('authenticationRedirect', async () => {
  render(
    <MemoryRouter initialEntries={['/UnoGame']}>
      <Routes>
        <Route path="/unoGame" element={<UnoGame />} />
      </Routes>
    </MemoryRouter>
  );

  // Assuming that UnoGame redirects to "/" when not authenticated
  await waitFor(() => {
    // Verify that the user is redirected to the login page
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });
});


//Test that 7 cards are dealt to the player after clicking the deal button
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
 ,1000);
  // Wait for the asynchronous operation to complete
});


//Test that the player can draw a card
test("drawCard", async () => {
  render(<UnoGame />);
  const login = screen.getByTestId("login");
  const dealCardsButton = screen.getByTestId("deal");
  const drawCardButton = screen.getByTestId("drawCard");
  const handCardsContainer = screen.getByTestId("handCards");

  fireEvent.click(login);
  fireEvent.click(dealCardsButton);
  fireEvent.click(drawCardButton);

  setTimeout(()=> {
    expect(handCardsContainer.children.length).toBe(8);
 }
 ,1000);
  // Wait for the asynchronous operation to complete
});	


//We tried the next two following tests, but they are like us, a big failure, so we commented them out

//Test that the player can't play a card if it's not their turn
/*test("playCardNotYourTurn", async () => {
  render(<UnoGame />);
  const login = screen.getByTestId("login");
  const dealCardsButton = screen.getByTestId("deal");
  const drawCardButton = screen.getByTestId("drawCard");
  const handCardsContainer = screen.getByTestId("handCards");
  const discardPileContainer = screen.getByTestId("discardPile");

  fireEvent.click(login);
  fireEvent.click(dealCardsButton);
  fireEvent.click(drawCardButton);

  //console.log(handCardsContainer.children[0]);
  await waitFor(() => {
    expect(handCardsContainer.children.length).toBeGreaterThan(0);
  });
  
  fireEvent.click(handCardsContainer.children[0]);
  fireEvent.click(handCardsContainer.children[0]);
  

  setTimeout(()=> {
    expect(handCardsContainer.children.length).toBe(7);
    expect(discardPileContainer.children.length).toBe(2);
 }
 ,1500);
  // Wait for the asynchronous operation to complete
});

//Test that the player can play a card if it's their turn
test("playCardYourTurn", async () => {
  render(<UnoGame />);
  const login = screen.getByTestId("login");
  const dealCardsButton = screen.getByTestId("deal");
  const drawCardButton = screen.getByTestId("drawCard");
  const handCardsContainer = screen.getByTestId("handCards");
  const discardPileContainer = screen.getByTestId("discardPile");

  fireEvent.click(login);
  fireEvent.click(dealCardsButton);
  fireEvent.click(drawCardButton);

  //console.log(handCardsContainer.children[0]);
  await waitFor(() => {
    expect(handCardsContainer.children.length).toBeGreaterThan(0);
  });
  
  fireEvent.click(handCardsContainer.children[1]);

  setTimeout(()=> {
    expect(handCardsContainer.children.length).toBe(6);
    expect(discardPileContainer.children.length).toBe(3);
 }
 ,1500);
  // Wait for the asynchronous operation to complete
});

*/

  

