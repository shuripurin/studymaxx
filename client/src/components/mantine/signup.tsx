import { useState } from "react";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Text as MantineText,
} from "@mantine/core";
import { Link, useNavigate } from "@tanstack/react-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../app/firebase";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setFormError("");
    setPasswordError("");

    if (!name || !email || !password || !confirmPassword) {
      setFormError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setName("");
      setEmail("");
      setPassword("");
      console.log(user);
      navigate({ to: "/" });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Create an account</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component={Link} to="/sign-in">
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          required
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <TextInput
          label="Email"
          placeholder="you@example.com"
          required
          mt="md"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <PasswordInput
          label="Password"
          placeholder="Create a password"
          required
          mt="md"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Repeat your password"
          required
          mt="md"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          error={passwordError}
        />
        <Group justify="space-between" mt="lg">
          <Checkbox label="I agree to the terms and conditions" />
        </Group>
        {formError && (
          <MantineText c="red" size="sm" mt="sm">
            {formError}
          </MantineText>
        )}
        <Button fullWidth mt="xl" onClick={handleSubmit}>
          Create account
        </Button>
      </Paper>
    </Container>
  );
}
