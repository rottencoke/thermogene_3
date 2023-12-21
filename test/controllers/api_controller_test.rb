require "test_helper"

class ApiControllerTest < ActionDispatch::IntegrationTest
  test "should get proxy" do
    get api_proxy_url
    assert_response :success
  end
end
