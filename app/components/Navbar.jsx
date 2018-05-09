import React from 'react'
import { Button, Menu } from 'semantic-ui-react'

const Navbar = () => (
  <Menu attached inverted>
    <Menu.Item>
      Peril
    </Menu.Item>
    <Menu.Menu position="right">
      <Menu.Item>
        <Button>Sign Up</Button>
      </Menu.Item>

      <Menu.Item>
        <Button>Log In</Button>
      </Menu.Item>
    </Menu.Menu>
  </Menu>
)

export default Navbar
