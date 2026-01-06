package main

import ( 
	"fmt" 
	"strconv"
)

func main() {
	fmt.Println("Is this device the server or client?")
	sc_opts := [2]string{"Server", "Client"}

	printOpts(sc_opts[:])
	selection := getIntInput(len(sc_opts) - 1)
	fmt.Println(fmt.Sprintf("\nSelected: %d - %s", selection, sc_opts[selection]))

	if sc_opts[selection] == "Server" {
		// Create Rocket.toml under vocab-api
		rocket_toml := "[default]\n"

		// Ask the IP address
		fmt.Println("\nWhat IP address do you want the API to listen to?")
		var rocket_addr string
		fmt.Scan(&rocket_addr)
		rocket_toml += fmt.Sprintf("address = \"%s\"\n", rocket_addr)
		// Ask the Port number
		fmt.Println("\nWhich port?")
		var rocket_port string
		fmt.Scan(&rocket_port)
		rocket_toml += fmt.Sprintf("port = %s\n", rocket_port)
		// Ask the DB location
		rocket_toml += "[default.databses.vocabs]\n"
		fmt.Println("\nEnter the path to database:")
		var sqlite_path string
		fmt.Scan(&sqlite_path)
		rocket_toml += fmt.Sprintf("url = \"%s\"\n", sqlite_path)

		fmt.Println("\nConfiguration done:")
		fmt.Println(rocket_toml)

		// r u ok w/ this config? if not, redo the config

		fmt.Println("Also, see README.md to build the app and correctly configure the firewall on your device.")
	} else if sc_opts[selection] == "Client" {
		// Create .env under vocab-client
		// API_LOCATION=???.???.???.???:8000
		dot_env_f := "API_LOCATION="
		fmt.Println("\nAt what IP address is the backend API available?")
		var ip_addr string
		fmt.Scan(&ip_addr)
		dot_env_f += ip_addr
		fmt.Println("\nWhich port?")
		var port string
		fmt.Scan(&port)
		dot_env_f += fmt.Sprintf(":%s\n", port)

		fmt.Println("\nConfiguration done:")
		fmt.Println(dot_env_f)
	}
}

func printOpts(opts []string) {
	opts_msg := ""
	for i := 0; i < len(opts); i++ {
		if i != 0 { opts_msg += "  "}
		opts_msg += fmt.Sprintf("%d - %s", i, opts[i])
		if i != (len(opts) - 1) {
		opts_msg += ","
		}
	}
	fmt.Println(opts_msg)
}

func getIntInput(max_val int) int {
	chosen := -1
	for chosen < 0 {
		var input string
		fmt.Scan(&input)
		val, err := strconv.ParseInt(input, 10, 64)
		val_int := int(val)

		if err == nil && val_int <= max_val {
			chosen = val_int
		} else if val_int > max_val {
			fmt.Println(fmt.Sprintf("%d is larger than the maximum value allowed (%d)", val, max_val))
		} else {
			fmt.Println(err)
		}
	}
	return int(chosen)
}
