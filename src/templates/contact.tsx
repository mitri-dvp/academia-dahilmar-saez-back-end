import * as React from "react";
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export function ContactEmail(data: ContactData) {
  return (
    <Html>
      <Head />
      <Preview>
        {data.name} ({data.email}): {data.message}
      </Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.content}>
            <Section>
              <Column style={styles.logo_col}>
                <Img
                  src={`https://academia-dahilmar-saez-front-end.vercel.app/_next/image?url=%2Flogo.png&w=640&q=75`}
                  width="42"
                  height="42"
                  alt="academia-dahilmar-saez-logo"
                  style={styles.logo}
                />
              </Column>

              <Column align="left" style={styles.logo_text}>
                <Text>Academia Dahilmar Saez</Text>
              </Column>
            </Section>

            <Heading style={styles.heading}>Mensaje de {data.name}</Heading>

            <Text style={styles.paragraph}>
              <Link href={`mailto:${data.email}`} style={styles.link}>
                {data.email}
              </Link>
            </Text>

            <Text style={styles.message}>{data.message}</Text>
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.footer}>
            <Text style={styles.footer_text}>
              ©2023 Academia Dahilmar Sáez. Todos los Derechos Reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  main: {
    backgroundColor: "#ffffff",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
    padding: "32px 0",
  },
  container: {
    margin: "0 auto",
    padding: "32px",
    width: "600px",
    backgroundColor: "#ffffff",
  },
  logo_col: {
    width: 42,
    height: 42,
  },
  logo: {
    width: 42,
    height: 42,
  },
  heading: {
    fontSize: "24px",
    letterSpacing: "-0.5px",
    lineHeight: "1.3",
    fontWeight: "400",
    color: "#484848",
    paddingTop: "32px",
  },
  paragraph: {
    marginBottom: "32px",
    fontSize: "16px",
    lineHeight: "1.4",
    color: "#484848",
  },
  message: {
    marginBottom: "32px",
    fontSize: "16px",
    lineHeight: "1.4",
    color: "#484848",
    padding: "24px",
    backgroundColor: "#f3f4f6",
    borderRadius: "4px",
  },
  link: {
    color: "#f15a25",
    textDecoration: "none",
  },
  hr: {
    borderColor: "#dfe1e4",
    marginBottom: "16px",
  },
  content: {},
  footer: {},
  footer_text: {
    fontSize: "14px",
  },
  logo_text: {
    display: "table-cell",
    paddingLeft: "16px",
  },
} as { [key: string]: React.CSSProperties };
