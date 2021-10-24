import { pick } from "ramda"
import { useEffect, useState } from "react"
import API from "../server/api"

function useDatabaseTest(getValues, watch) {
  const [status, setStatus] = useState("idle")

  useEffect(() => {
    const subscription = watch((_, { name: filedName }) => {
      const connectDBFields = ["databaseName", "endpoint", "port", "username", "password"]
      if (connectDBFields.includes(filedName)) {
        setStatus("idle")
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const handleTest = () => {
    setStatus("loading")
    API.postMysqlPing(pick(["databaseName", "endpoint", "port", "username", "password"], getValues()))
      .then(res => {
        setStatus(res.status ? "success" : "fail")
      })
      .catch(() => setStatus("fail"))
  }

  return {
    test: handleTest,
    status,
  }
}

export { useDatabaseTest }
