<script>
    export let member;
  </script>
  
  <article class="single-item">
    <div class="item">
      <div class="card-img">
        <img
          class="img-size"
          src={member.image}
          alt={`Foto van ${member.name}`}
        />
  
        <div class="overlay">
          <h4>{member.name}</h4>
          <p>{member.bio}</p>
        </div>
      </div>
  
      <div class="info">
        <h4>{member.name}</h4>
        <span class="role">{member.role}</span>
      </div>
    </div>
  </article>
  
  <style>
    /* Card */
    .single-item {
      margin-bottom: 0;
    }
  
    .item .card-img {
      position: relative;
      overflow: hidden;
      z-index: 1;
      height: 380px;
    }
  
    .item .card-img::after {
      background: var(--color-secondary);
      content: "";
      height: 100%;
      left: 0;
      opacity: 0;
      position: absolute;
      top: 0;
      transition: all 0.6s ease-in-out;
      width: 100%;
    }
  
    .item:hover .card-img::after {
      opacity: 0.7;
    }
  
    .img-size {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: all 0.35s ease-in-out;
    }
  
    .item:hover .card-img img {
      opacity: 0.6;
    }
  
    .card-img .overlay {
      top: -100%;
      left: 0;
      padding: 20px;
      position: absolute;
      text-align: center;
      transition: all 0.35s ease-in-out;
      width: 100%;
      z-index: 1;
    }
  
    .item:hover .card-img .overlay {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  
    .card-img .overlay h4,
    .card-img .overlay p {
      color: #ffffff;
    }
  
    .card-img .overlay h4 {
      display: inline-block;
      text-transform: uppercase;
    }
  
    /* Social */
    .social ul {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 12px;
      padding: 0;
      list-style: none;
    }
  
    .social a {
      color: #fff;
      padding: 8px 12px;
      font-size: 14px;
      line-height: 1;
      text-decoration: none;
    }
  
    /* Info blok (ongewijzigd van origineel) */
    .info {
      background: var(--color-secondary);
      box-shadow: 0 0 10px var(--color-secondary);
      padding: 40px 20px 20px;
      text-align: center;
      position: relative;
      z-index: 2;
    }
  
    .info h4 {
      font-weight: 600;
      margin-bottom: 5px;
      text-transform: capitalize;
    }
  
    .role {
      color: var(--color-primary-lightest);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 22px;
      letter-spacing: 0.6px;
    }
  </style>
  