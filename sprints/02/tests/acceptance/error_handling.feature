Feature: Error handling — US-05
  As a user
  I want clear error messages with a retry option
  So that I can recover from transient API failures

  Background:
    Given the mock scenario is "error"

  Scenario: API error shows ErrorBanner with retry button
    When I open the "/admin/dashboard" page
    Then I see the ErrorBanner component
    And the message contains "Nem sikerült betölteni"
    And I see a "Újrapróbálás" button

  Scenario: Retry triggers refetch after the API recovers
    Given the API is currently failing
    When I see the ErrorBanner
    And I switch the mock scenario to "normal"
    And I click "Újrapróbálás"
    Then the data is loaded successfully
    And the ErrorBanner disappears

  Scenario: ErrorBanner has correct ARIA semantics
    When the API fails
    Then the ErrorBanner has role="alert"
    And it has aria-live="assertive"
