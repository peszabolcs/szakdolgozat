Feature: Empty state — US-01
  As an admin user
  I want to see a meaningful empty state
  So that I know how to start using the system

  Background:
    Given I am logged in as admin
    And the mock scenario is "empty"

  Scenario: Dashboard shows empty state when no centers exist
    When I open the "/admin/dashboard" page
    Then I see the EmptyState component
    And I see the title "Még nincs bevásárlóközpont"
    And I see an SVG illustration

  Scenario: Empty state CTA is keyboard accessible
    When I open the "/admin/shopping-centers" page
    Then the CTA button has role="button"
    And the CTA can receive keyboard focus
    And the CTA can be activated with Enter

  Scenario: Empty reservation list shows the dedicated empty state
    Given I have no active reservations
    When I open the "/admin/reservations" page
    Then I see the EmptyState component
    And the message is "Még nem foglaltál parkolót"
    And there is a CTA button "Foglalj most"
