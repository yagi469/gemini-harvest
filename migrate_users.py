import os
import psycopg2
import requests
import sys
import secrets # Add this import
import string # Add this import

# Supabase Database Configuration
DB_HOST = "db.nsnpuroomnhzmriysgvo.supabase.co"
DB_PORT = "5432"
DB_NAME = "postgres"
DB_USER = "postgres"

# Clerk API Configuration
CLERK_API_BASE_URL = "https://api.clerk.com/v1"

# Function to generate a random password
def generate_random_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(secrets.choice(characters) for i in range(length))
    return password

def migrate_users():
    # Retrieve sensitive information from environment variables
    db_password = os.getenv("SUPABASE_DB_PASSWORD")
    clerk_secret_key = os.getenv("CLERK_SECRET_KEY")

    if not db_password:
        print("Error: SUPABASE_DB_PASSWORD environment variable not set.")
        sys.exit(1)
    if not clerk_secret_key:
        print("Error: CLERK_SECRET_KEY environment variable not set.")
        sys.exit(1)

    conn = None
    cur = None
    try:
        # Connect to Supabase PostgreSQL
        print("Connecting to Supabase database...")
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=db_password
        )
        cur = conn.cursor()
        print("Successfully connected to Supabase.")

        # Fetch users from reservation table
        print("Fetching users from 'reservation' table...")
        cur.execute("SELECT user_email, user_name FROM reservation;")
        users_to_migrate = cur.fetchall()
        print(f"Found {len(users_to_migrate)} users to potentially migrate.")

        # Migrate users to Clerk
        clerk_headers = {
            "Authorization": f"Bearer {clerk_secret_key}",
            "Content-Type": "application/json"
        }

        for email, name in users_to_migrate:
            print(f"Processing user: {email}...")
            
            # Generate a random password for the user
            generated_password = generate_random_password()

            # Clerk API expects email_address, first_name, and now password
            user_data = {
                "email_address": [email],
                "first_name": name,
                "password": generated_password # Add the generated password
            }
            
            try:
                response = requests.post(
                    f"{CLERK_API_BASE_URL}/users",
                    headers=clerk_headers,
                    json=user_data
                )
                response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
                print(f"Successfully created user {email} in Clerk.")
            except requests.exceptions.HTTPError as e:
                if response.status_code == 422:
                    # 422 Unprocessable Entity often means user already exists or invalid data
                    error_details = response.json()
                    if any("email_address" in err.get("long_message", "") and "already exists" in err.get("long_message", "") for err in error_details.get("errors", [])):
                        print(f"User {email} already exists in Clerk. Skipping.")
                    else:
                        print(f"Error creating user {email} in Clerk (HTTP 422): {error_details}")
                else:
                    print(f"HTTP Error creating user {email} in Clerk: {e}")
                    print(f"Response: {response.text}")
            except requests.exceptions.RequestException as e:
                print(f"Network or request error creating user {email} in Clerk: {e}")
            except Exception as e:
                print(f"An unexpected error occurred for user {email}: {e}")

    except psycopg2.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
        print("Database connection closed.")

if __name__ == "__main__":
    migrate_users()