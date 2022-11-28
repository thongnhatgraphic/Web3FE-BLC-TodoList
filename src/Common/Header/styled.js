import styled from "styled-components";

export const Header = styled.div`
    width: 100%;
    height: 70px;
    background-color: rgba(225,225,225,.4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo {
        img {
            width: 50px;
        }
    }

    .block_wallet {
        display: flex;
        align-items: center;
        .block_money {
            display: flex;
            align-items: center;
            margin-right: 20px;
            .address {
                cursor: pointer;
                background: #f3d5ff;
                margin-right: 10px;
                padding: 6px 10px;
                border-radius: 10px;
                &:hover {
                    opacity: .7;

                }
            }
            .balance {
                cursor: pointer;
                background: #c8db2f;
                margin-right: 10px;
                padding: 6px 10px;
                border-radius: 10px;
                &:hover {
                    opacity: .7;

                }
            }
        }
    }
`