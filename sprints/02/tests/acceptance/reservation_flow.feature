Feature: Reservation flow — US-06
  As a visitor
  I want to reserve a parking spot at a shopping center for a future time slot
  So that I have a guaranteed space when I arrive

  Background:
    Given the mock scenario is "normal"
    And the public home page is open

  Scenario: Successful reservation from a shopping center card
    When I click the "Foglalás" button on the "Westend" card
    Then the ReservationModal opens
    And the center is preselected to "Westend"

    When I select a date in the future
    And I select an available time slot "14:00"
    And I click "Foglalás megerősítése"
    Then a success toast appears with "Sikeres foglalás"
    And the modal closes
    And the reservation is saved to localStorage under "parkvision.reservations.v1"

  Scenario: Reserving in the past is blocked
    When I open the ReservationModal
    And I select a past time slot
    Then I see an inline error "A választott időslot a múltban van"
    And the "Foglalás megerősítése" button is disabled

  Scenario: Reserving a fully occupied center is blocked
    Given "Allee" has 100% occupancy
    When I open the ReservationModal preselected to "Allee"
    And I attempt to confirm
    Then I see a warning toast "A központ jelenleg telített"
    And the reservation is not created

  Scenario: Viewing and cancelling reservations
    Given I have at least one active reservation
    When I open the "/admin/reservations" page
    Then I see the reservation under "Közelgő" tab
    When I click "Lemondás"
    Then the reservation status becomes "cancelled"
    And it appears in the "Múlt" tab
