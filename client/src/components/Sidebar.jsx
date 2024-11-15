import { Box, Stack, Text, Flex, Button } from "@chakra-ui/react";
import "./sidebar.css"
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <Box width="105px" padding="6px" borderWidth="1px" overflow="hidden">
      <Flex gap=".5em" alignItems="stretch" direction="column" align="center">
      <NavLink to="/app/dashboardob" activeClassName="active">
          <Box padding="8px 12px" borderRadius="8px" _hover={{ backgroundColor: "rgb(50, 201, 196, 0.2)" }}>
            <Flex size="lg" direction="column" justify="center" align="center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#379795"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7" />
                <path d="M15 7h6v6" />
              </svg>
              <Text size="md">Dashboard</Text>
            </Flex>
          </Box>
        </NavLink>
        <NavLink to="/app/dashboard" activeClassName="active">
          <Box padding="8px 12px" borderRadius="8px" _hover={{ backgroundColor: "rgb(50, 201, 196, 0.2)" }}>
            <Flex size="lg" direction="column" justify="center" align="center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#379795"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7" />
                <path d="M15 7h6v6" />
              </svg>
              <Text size="md">Bookmarks</Text>
            </Flex>
          </Box>
        </NavLink>
        <NavLink to="/app/dashboard" activeClassName="active">
          <Box padding="8px 12px" borderRadius="8px" _hover={{ backgroundColor: "rgb(50, 201, 196, 0.2)" }}>
            <Flex size="lg" direction="column" justify="center" align="center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#379795"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7" />
                <path d="M15 7h6v6" />
              </svg>
              <Text size="md">Tests</Text>
            </Flex>
          </Box>
        </NavLink>
        <NavLink to="/app/addTest" activeClassName="active">
          <Box padding="8px 12px" borderRadius="8px" _hover={{ backgroundColor: "rgb(50, 201, 196, 0.2)" }}>
            <Flex size="lg" direction="column" justify="center" align="center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#379795"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <Text size="md">Add Test</Text>
            </Flex>
          </Box>
        </NavLink>
        <NavLink to="/app/groups" activeClassName="active">
          <Box padding="8px 12px" borderRadius="8px" _hover={{ backgroundColor: "rgb(50, 201, 196, 0.2)" }}>
            <Flex size="lg" direction="column" justify="center" align="center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#379795"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <Text size="md">Groups</Text>
            </Flex>
          </Box>
        </NavLink>
        <NavLink to="/app/friends" activeClassName="active">
          <Box padding="8px 12px" borderRadius="8px" _hover={{ backgroundColor: "rgb(50, 201, 196, 0.2)" }}>
            <Flex size="lg" direction="column" justify="center" align="center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#379795"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <Text size="sm">Friends</Text>
            </Flex>
          </Box>
        </NavLink>
      </Flex>
    </Box>
  );
}
